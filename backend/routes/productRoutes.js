import express from 'express';
const router = express.Router();
import { getProducts, addProduct, deleteProduct } from '../controllers/productController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/')
    .get(protect, getProducts)
    .post(protect, admin, addProduct);

router.route('/:id')
    .delete(protect, admin, deleteProduct);

export default router;
