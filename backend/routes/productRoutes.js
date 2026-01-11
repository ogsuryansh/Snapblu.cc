import express from 'express';
const router = express.Router();
import {
    getProducts,
    addProduct,
    deleteProduct,
    checkBin,
    checkCard
} from '../controllers/productController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/')
    .get(protect, getProducts)
    .post(protect, admin, addProduct);

router.post('/check-bin', protect, checkBin);
router.post('/check-card', protect, checkCard);

router.route('/:id')
    .delete(protect, admin, deleteProduct);

export default router;
