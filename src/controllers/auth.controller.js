import { registerSchema, getRegisterSchema } from "../schemas/auth.schema.js";

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
const prisma = new PrismaClient();

import { loginSchema } from "../schemas/auth.schema.js";
import { sendEmail } from "../services/mail.service.js";

export const loginPage = (req, res) => {
    res.render('auth/login', {
        title: 'Login',
        layout: false
    });
}

export const registerPage = (req, res) => {
    res.render('auth/signup', {
        title: 'Sign Up',
        layout: false
    });
}

export const register = async(req, res) => {
    try {
        const schema = getRegisterSchema(req.path);
        const validated = await schema.parseAsync(req.body);

        const fullName = validated.firstName + " " + validated.lastName;

        const user = await prisma.user.create({
            data: {
                name: fullName,
                email: validated.email,
                phone: validated.phone,
                password: bcrypt.hashSync(validated.password, 10)
            }
        })

        if (!user) {
            // req.flash('error_msg', 'Failed to register. Please try again.');
            // res.redirect('/signup');

            return res.status(500).json({
                success: false,
                message: "Failed to register. Please try again."
            })
        }

        const token = jwt.sign({
            id: user.id,
            email: user.email,
            role: user.role
        }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

        if (!token) {
            // req.flash('error_msg', 'Failed to register. Please try again.');
            // res.redirect('/signup');

            return res.status(500).json({
                success: false,
                message: "Failed to register. Please try again."
            })
        }

        req.session.user = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: token
        }

        // req.flash('success_msg', 'Successfully registered. Please login.');
        // res.redirect('/');

        return res.status(200).json({
            success: true,
            message: "Successfully registered. Please login.",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                token: token
            }
        })

    } catch (error) {
        if (error.name === "ZodError") {
            // req.flash('error_msg', error.issues[0].message);
            // res.redirect('/signup');

            return res.status(422).json({
                success: false,
                errorOn: error.issues[0].path[0],
                message: error.issues[0].message,
                error: JSON.parse(error)
            })
        }
        // req.flash('error_msg', 'Server error');
        // res.redirect('/signup');

        return res.status(500).json({
            success: false,
            message: "Server error",
        })
    }
}

export const login = async(req, res) => {
    try {
        const validated = loginSchema.parse(req.body);

        const user = await prisma.user.findUnique({
            where: {
                email: validated.email
            }
        })

        if (!user) {
            req.flash('error_msg', 'Email or password is incorrect');
            res.redirect('/login');
        }

        if (user.role === 'ADMIN') {
            req.flash('error_msg', 'Email or password is incorrect');
            res.redirect('/login');
        }

        const isMatch = await bcrypt.compare(validated.password, user.password);

        if (!isMatch) {
            req.flash('error_msg', 'Email or password is incorrect');
            res.redirect('/login');
        }

        const token = jwt.sign({
            id: user.id,
            email: user.email,
            role: user.role
        }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

        if (!token) {
            req.flash('error_msg', 'Failed to login. Please try again.');
            res.redirect('/login');
        }

        req.session.user = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: token
        }

        req.flash('success_msg', 'Successfully logged in');
        res.redirect('/app');
    } catch (error) {
        if (error.name === "ZodError") {
            req.flash('error_msg', error.issues[0].message);
            res.redirect('/login');
        }
        req.flash('error_msg', 'Server error');
        res.redirect('/login');
    }
}

export const logout = (req, res) => {
    req.session.destroy();
    res.redirect('/');
}

export const registerRequest = async(req, res) => {
    try {
        const schema = getRegisterSchema(req.path);
        const validated = await schema.parseAsync(req.body);

        let isEmailOrPhone = null
        if (validated.email) {
            isEmailOrPhone = 'email'
        } else if (validated.phone) {
            isEmailOrPhone = 'phone'
        } else {
            isEmailOrPhone = null
        }

        const otp = Math.floor(100000 + Math.random() * 900000);

        const otpSaved = await prisma.emailOrPhoneVerification.upsert({
            where: { emailOrPhone: validated.email || validated.phone },
            update: {
                otp: String(otp),
                data: {
                    name: validated.firstName + " " + validated.lastName,
                },
                expiresAt: new Date(Date.now() + 5 * 60 * 1000)
            },
            create: {
                emailOrPhone: validated.email || validated.phone,
                otp: String(otp),
                data: {
                    name: validated.firstName + " " + validated.lastName,
                },
                expiresAt: new Date(Date.now() + 5 * 60 * 1000)
            }
        })

        if (!otpSaved) {
            return res.status(500).json({
                success: false,
                message: 'Failed to send OTP. Please try again.'
            })
        }

        sendOtpToEmailOrPhone({ otp, isEmailOrPhone, validated });

        // req.flash('success_msg', 'OTP sent successfully');
        // res.redirect('/');

        return res.status(200).json({
            success: true,
            message: `An OTP has been sent to your ${isEmailOrPhone}`
        })

    } catch (error) {
        // console.log(error);

        if (error.name === "ZodError") {
            console.log('hrerere');

            return res.status(422).json({
                success: false,
                errorOn: error.issues[0].path[0],
                message: error.issues[0].message,
                error: JSON.parse(error)
            })
        }
        return res.status(500).json({
            success: false,
            message: 'Server error'
        })
    }
}

function sendOtpToEmailOrPhone({ otp, isEmailOrPhone, validated }) {
    // console.log(validated);

    if (isEmailOrPhone === 'email') {
        // send email
        sendEmail({
            to: validated.email,
            subject: 'OTP for email verification',
            text: `Yout OTP is ${otp}. Please do not share with anyone`,
            html: `<p>Yout OTP is ${otp}. Please do not share with anyone</p>`
        })

    } else if (isEmailOrPhone === 'phone') {
        // send sms
        console.log(`Yout OTP is ${otp}`);
    }
}