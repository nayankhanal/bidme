import express from 'express';
import { homePage } from '../controllers/home.controller.js';
import { adminLoginPage, loginPage, registerPage } from '../controllers/auth.controller.js';
import { dashboardPage } from '../controllers/admin/dashboard.controller.js';

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
router.get('/admin/login', adminLoginPage)
router.get('/admin/dashboard', dashboardPage)

export default router;