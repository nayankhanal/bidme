import express from 'express';
import { homePage } from '../controllers/home.controller.js';
import { loginPage, registerPage, register, login, registerRequest } from '../controllers/auth.controller.js';
import { adminLogin, adminLoginPage, adminLogout } from '../controllers/admin/auth.controller.js'
import { dashboardPage } from '../controllers/admin/dashboard.controller.js';

import { isAuthenticated, isAdmin } from '../middlewares/auth.middleware.js';

const router = express.Router();

// router.get('/', (req, res) => {
//     res.render('home', {
//         title: 'Home',
//         activeAuctionsCount: 247
//     });
// })

router.get('/', homePage)
router.get('/login', loginPage)
router.get('/signup', registerPage)
router.post('/signup', register)
router.get('/login', login)

router.post('/signup-request', registerRequest)


// for admin only
router.get('/admin/login', adminLoginPage)
router.post('/admin/login', adminLogin)
router.post('/admin/logout', adminLogout)

router.get('/admin/dashboard', isAuthenticated, isAdmin, dashboardPage)

export default router;