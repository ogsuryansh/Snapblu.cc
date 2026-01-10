import asyncHandler from 'express-async-handler';
import Product from '../models/productModel.js';
import User from '../models/userModel.js';
import Transaction from '../models/transactionModel.js';

// @desc    Purchase a card
// @route   POST /api/orders/purchase/:id
// @access  Private
const purchaseProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    const user = await User.findById(req.user._id);

    if (!product) {
        res.status(404);
        throw new Error('Product not found');
    }

    if (product.isSold) {
        res.status(400);
        throw new Error('Product is already sold');
    }

    if (user.balance < product.price) {
        res.status(400);
        throw new Error('Insufficient balance. Please deposit funds.');
    }

    // 1. Deduct Balance
    user.balance -= product.price;
    await user.save();

    // 2. Mark Product as Sold
    product.isSold = true;
    product.soldTo = user._id;
    product.soldAt = Date.now();
    await product.save();

    // 3. Create Transaction Record
    await Transaction.create({
        user: user._id,
        type: 'purchase',
        amount: product.price,
        description: `Purchased ${product.type} ${product.bin} - ${product.brand}`,
        status: 'completed'
    });

    // 4. Return Product Data (Now revealing the hidden 'data' field)
    res.json({
        success: true,
        message: 'Purchase successful!',
        product: {
            ...product._doc,
            data: product.data // This contains the sensistive CC info
        }
    });
});

// @desc    Get logged in user's purchased products
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
    // Find products sold to this user
    const products = await Product.find({ soldTo: req.user._id, isSold: true }).sort({ soldAt: -1 });
    res.json(products);
});

export { purchaseProduct, getMyOrders };
