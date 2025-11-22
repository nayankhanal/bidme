import express from 'express';
const router = express.Router();

import { adminLogin, adminLoginPage, adminLogout } from '../controllers/admin/auth.controller.js'
import { dashboardPage } from '../controllers/admin/dashboard.controller.js';

import { isAuthenticated, isAdmin, isGuest } from '../middlewares/auth.middleware.js';

router.get('/login', isGuest, adminLoginPage)
router.post('/login', isGuest, adminLogin)
router.post('/logout', adminLogout)

router.get('/dashboard', isAuthenticated, isAdmin, dashboardPage)

export default router