import express from 'express';
const router = express.Router();
import {
    purchaseProduct,
    getMyOrders,
    getAllOrders,
    refundProduct
} from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.post('/purchase/:id', protect, purchaseProduct);
router.get('/myorders', protect, getMyOrders);
router.get('/all', protect, admin, getAllOrders);
router.post('/refund/:id', protect, admin, refundProduct);

export default router;
