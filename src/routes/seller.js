import express from 'express';
const router = express.Router();

import { homePage } from '../controllers/home.controller.js';
import { sellerApp, activeAuctions } from '../controllers/user/app.controller.js';

router.get('/app', sellerApp)
router.get('/active-auctions', activeAuctions)

export default router;