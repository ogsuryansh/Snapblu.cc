import express from 'express';
const router = express.Router();
import { createDeposit, getDeposits, updateDepositStatus } from '../controllers/depositController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/')
    .post(protect, createDeposit)
    .get(protect, getDeposits);

router.route('/:id')
    .put(protect, admin, updateDepositStatus);

export default router;
