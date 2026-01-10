import asyncHandler from 'express-async-handler';
import Transaction from '../models/transactionModel.js';

// @desc    Get my transactions
// @route   GET /api/transactions
// @access  Private
const getMyTransactions = asyncHandler(async (req, res) => {
    const transactions = await Transaction.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(transactions);
});

export { getMyTransactions };
