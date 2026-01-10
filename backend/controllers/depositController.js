import asyncHandler from 'express-async-handler';
import Deposit from '../models/depositModel.js';
import User from '../models/userModel.js';
import Transaction from '../models/transactionModel.js';

// @desc    Create new deposit request
// @route   POST /api/deposits
// @access  Private
const createDeposit = asyncHandler(async (req, res) => {
    const { amount, transactionId, method } = req.body;

    if (!amount || !transactionId) {
        res.status(400);
        throw new Error('Please provide amount and transaction ID');
    }

    if (amount < 10) {
        res.status(400);
        throw new Error('Minimum deposit amount is $10');
    }

    const deposit = new Deposit({
        user: req.user._id,
        amount,
        transactionId,
        method: method || 'BTC',
        status: 'pending'
    });

    const createdDeposit = await deposit.save();
    res.status(201).json(createdDeposit);
});

// @desc    Get all deposits (Admin) or My Deposits (User)
// @route   GET /api/deposits
// @access  Private
const getDeposits = asyncHandler(async (req, res) => {
    if (req.user.isAdmin) {
        const deposits = await Deposit.find({}).populate('user', 'username email').sort({ createdAt: -1 });
        res.json(deposits);
    } else {
        const deposits = await Deposit.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(deposits);
    }
});

// @desc    Update deposit status (Approve/Reject)
// @route   PUT /api/deposits/:id
// @access  Private/Admin
const updateDepositStatus = asyncHandler(async (req, res) => {
    const { status } = req.body; // 'approved' or 'rejected'
    const deposit = await Deposit.findById(req.params.id);

    if (!deposit) {
        res.status(404);
        throw new Error('Deposit not found');
    }

    if (deposit.status !== 'pending') {
        res.status(400);
        throw new Error('Deposit already processed');
    }

    deposit.status = status;
    await deposit.save();

    res.json(deposit);
});

export { createDeposit, getDeposits, updateDepositStatus };
