import express from 'express';
const router = express.Router();

import { sellerDashboard } from '../controllers/user/seller/dashboard.controller.js';
import { activeAuctions, createAuction } from '../controllers/user/seller/auction.controller.js';
import { orders } from '../controllers/user/seller/order.controller.js';

//dashboard
router.get('/dashboard', sellerDashboard)

//auctions
router.get('/auctions', activeAuctions)
router.get('/auctions/create', createAuction)

// orders
router.get('/orders', orders)

export default router;