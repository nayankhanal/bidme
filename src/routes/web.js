import express from 'express';
const router = express.Router();

import { homePage } from '../controllers/home.controller.js';
import { buyerApp } from '../controllers/user/app.controller.js';
import { isAuthenticated, isCustomer } from '../middlewares/auth.middleware.js';


router.get('/', homePage)

router.get('/app', isAuthenticated, isCustomer, buyerApp)

export default router;