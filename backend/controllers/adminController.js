import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import Product from '../models/productModel.js';

import Transaction from '../models/transactionModel.js';

// @desc    Get admin dashboard statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
const getDashboardStats = asyncHandler(async (req, res) => {
    // 1. Total Users
    const totalUsers = await User.countDocuments({});

    // 2. Product Stats
    const products = await Product.find({});

    // 3. Recent Activity (Latest 5 transactions)
    const recentActivity = await Transaction.find({})
        .populate('user', 'username email')
        .sort({ createdAt: -1 })
        .limit(5);

    let totalStock = 0;
    let totalSales = 0;
    let totalRevenue = 0;

    products.forEach(product => {
        if (product.isSold) {
            totalSales++;
            totalRevenue += product.price;
        } else {
            totalStock++;
        }
    });

    res.json({
        totalUsers,
        totalStock,
        totalSales,
        totalRevenue: Number(totalRevenue.toFixed(2)),
        recentActivity
    });
});

export { getDashboardStats };
