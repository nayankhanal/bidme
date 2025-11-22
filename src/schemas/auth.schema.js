import { z } from "zod";
import dns from "node:dns/promises";

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const phoneRegex = /^(97|98)\d{8}$/;
const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const registerSchema = z.object({
        firstName: z.string("First name is required").min(3, { message: "Name must be at least 3 characters" }).max(50, { message: "Name must be at most 50 characters" }),
        lastName: z.string("Last name is required").min(3, { message: "Name must be at least 3 characters" }).max(50, { message: "Name must be at most 50 characters" }),
        email: z
            .string()
            .email()
            .optional()
            .refine(async(value) => {
                if (!value) return true
                const domain = value.split("@")[1];

                try {
                    const mx = await dns.resolveMx(domain);
                    return mx.length > 0
                } catch (error) {
                    return false
                }

            }, "Invalid email")
            .refine(async(value) => {
                // Unique check
                const exists = await prisma.user.findUnique({
                    where: { email: value }
                });

                return !exists;
            }, "Email already exists"),
        phone: z
            .string("Phone number is required")
            .regex(phoneRegex, "Phone must start with 97 or 98 and be 10 digits")
            .optional()
            .refine(async(value) => {
                if (!value) return true;

                const exists = await prisma.user.findUnique({
                    where: { phone: value }
                });

                return !exists;
            }, { message: "Phone number already exists" }),

        password: z.string("Password is required").regex(passwordRegex, "Password must contain uppercase, lowercase, digit, special character and be 8+ chars"),
        confirmPassword: z.string("Password confirmation is required"),
        otp: z
            .string()
            .regex(/^\d{6}$/, "OTP must contain 6 digits number")
            .optional()
    })
    .refine((data) => data.email || data.phone, {
        message: "Email or phone is required",
        path: ["email", "phone"],
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });


// Create a function to get the schema based on the path
export const getRegisterSchema = (path) => {
    if (path === '/signup') {
        return registerSchema.superRefine(async(data, ctx) => {
            // Must have OTP
            if (!data.otp) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "OTP is required",
                    path: ["otp"],
                });
                return;
            }

            const record = await prisma.emailOrPhoneVerification.findFirst({
                where: {
                    emailOrPhone: data.email || data.phone,
                    otp: data.otp,
                },
            });

            if (!record) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Invalid OTP",
                    path: ["otp"],
                });
                return;
            }

            if (record.expiresAt < new Date()) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "OTP expired",
                    path: ["otp"],
                });
            }
        }, { async: true });

    }
    return registerSchema;
};



export const loginSchema = z.object({
        email: z.string().optional(),
        phone: z.string().regex(phoneRegex, "Phone must start with 97 or 98 and be 10 digits").optional(),
        password: z.string().min(8),
    })
    .refine((data) => data.email || data.phone, {
        message: "Email or phone is required",
        path: ["email", "phone"],
    })


export const adminLoginSchema = z.object({
    email: z.string(),
    password: z.string(),
})