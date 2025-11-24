import express from 'express';
const router = express.Router();

import { loginPage, registerPage, register, login, registerRequest } from '../controllers/auth.controller.js';
// import { isGuest } from '../middlewares/auth.middleware.js';

router.get('/login', loginPage)
router.get('/signup', registerPage)

router.post('/signup', register)
router.post('/login', login)

router.post('/signup-request', registerRequest)

export default router