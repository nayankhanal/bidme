import { registerSchema } from "../schemas/auth.schema.js";

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
const prisma = new PrismaClient();

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

export const register = (req, res) => {
    try {
        const validated = registerSchema.parse(req.body);

        const user = prisma.user.create({
            data: {
                name: validated.name,
                email: validated.email,
                phone: validated.phone,
                password: bcrypt.hashSync(validated.password, 10)
            }
        })

        if (!user) {
            req.flash('error_msg', 'Failed to register. Please try again.');
            res.redirect('/signup');
        }

        const token = jwt.sign({
            id: user.id,
            email: user.email,
            role: user.role
        }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

        if (!token) {
            req.flash('error_msg', 'Failed to register. Please try again.');
            res.redirect('/signup');
        }

        res.session.user = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: token
        }

        req.flash('success_msg', 'Successfully registered. Please login.');
        res.redirect('/');

    } catch (error) {
        if (error.name === "ZodError") {
            res.flash('error_msg', error.issues[0].message);
            res.redirect('/signup');
        }
        req.flash('error_msg', 'Server error');
        res.redirect('/signup');
    }
}