import { z } from "zod";

const phoneRegex = /^(97|98)\d{8}$/;
const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const registerSchema = z.object({
        name: z.string(),
        email: z.string().optional(),
        phone: z.string().regex(phoneRegex, "Phone must start with 97 or 98 and be 10 digits").optional(),
        password: z.string().regex(passwordRegex, "Password must contain uppercase, lowercase, digit, special character and be 8+ chars"),
        confirmPassword: z.string().min(8),
    })
    .refine((data) => data.email || data.phone, {
        message: "Email or phone is required",
        path: ["email", "phone"],
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });



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