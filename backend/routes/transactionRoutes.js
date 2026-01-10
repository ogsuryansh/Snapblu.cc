import express from 'express';
const router = express.Router();
import { getMyTransactions } from '../controllers/transactionController.js';
import { protect } from '../middleware/authMiddleware.js';

router.route('/').get(protect, getMyTransactions);

export default router;
