import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import Product from '../models/productModel.js';

// @desc    Get admin dashboard statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
const getDashboardStats = asyncHandler(async (req, res) => {
    // 1. Total Users
    const totalUsers = await User.countDocuments({});

    // 2. Product Stats
    const products = await Product.find({});

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
        totalRevenue
    });
});

export { getDashboardStats };
