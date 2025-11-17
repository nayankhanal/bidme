import { adminLoginSchema } from "../../schemas/auth.schema.js";
import { registerPage } from "../auth.controller.js";

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';

export const adminLoginPage = (req, res) => {
    res.render('admin/login', {
        title: 'Admin Login',
        layout: false
    });
}

export const adminLogin = async(req, res) => {
    try {
        const validated = adminLoginSchema.parse(req.body);

        const { email, password } = validated;

        // fetch user/admin by email
        const user = await prisma.user.findUnique({
            where: { email }
        })

        if (!user || user.role !== 'ADMIN') {
            // return res.status(401).json({
            //     success: false,
            //     message: "Invalid credentials"
            // })

            req.flash('error_msg', 'Invalid credentials');
            return res.redirect('/admin/login');
        }

        // compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            // return res.status(401).json({
            //     success: false,
            //     message: "Email or password is incorrect"
            // })
            req.flash('error_msg', 'Email or password is incorrect');
            return res.redirect('/admin/login');
        }

        // generate token
        const token = jwt.sign({
            id: user.id,
            email: user.email,
            role: user.role
        }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

        if (!token) {
            // return res.status(500).json({
            //     success: false,
            //     message: "Something went wrong. Please try again"
            // })

            req.flash('error_msg', 'Something went wrong. Please try again');
            return res.redirect('/admin/login');
        }

        // return res.status(200).json({
        //     success: true,
        //     message: "Login successful",
        //     token
        // })

        req.session.user = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: token
        };

        req.flash('success_msg', 'Login successful');
        return res.redirect('/admin/dashboard');
    } catch (error) {
        // if (error.name === 'ZodError') {
        //     return res.status(400).json({ errors: error.errors });
        // }
        // res.status(500).json({ message: 'Server error' });

        if (error.name === 'ZodError') {
            req.flash('error_msg', error.issues[0].message);
            return res.redirect('/admin/login');
        }
        req.flash('error_msg', 'Server error');
        res.redirect('/admin/login');
    }
}