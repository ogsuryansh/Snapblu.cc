import express from 'express';
const router = express.Router();
import { purchaseProduct, getMyOrders } from '../controllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js';

router.post('/purchase/:id', protect, purchaseProduct);
router.get('/myorders', protect, getMyOrders);

export default router;
