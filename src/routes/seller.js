import express from 'express';
const router = express.Router();

import { homePage } from '../controllers/home.controller.js';
import { sellerApp, sellerApp2 } from '../controllers/user/app.controller.js';
import { isAuthenticated, isCustomer } from '../middlewares/auth.middleware.js';

router.get('/app', sellerApp)

router.get('/app2', sellerApp2)

export default router;