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
    const description = product.type === 'card'
        ? `Purchased Card ${product.bin} - ${product.brand}`
        : `Purchased Log: ${product.name}`;

    await Transaction.create({
        user: user._id,
        type: 'purchase',
        amount: product.price,
        description: description,
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
    // Sort by soldAt (newest first), fallback to updatedAt for old purchases without soldAt
    const products = await Product.find({ soldTo: req.user._id, isSold: true })
        .sort({ soldAt: -1, updatedAt: -1 });
    res.json(products);
});

// @desc    Get all sold products (Admin)
// @route   GET /api/orders/all
// @access  Private/Admin
const getAllOrders = asyncHandler(async (req, res) => {
    const orders = await Product.find({ isSold: true })
        .populate('soldTo', 'username email')
        .sort({ soldAt: -1 });
    res.json(orders);
});

// @desc    Refund a purchase
// @route   POST /api/orders/refund/:id
// @access  Private/Admin
const refundProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        res.status(404);
        throw new Error('Product not found');
    }

    if (!product.isSold) {
        res.status(400);
        throw new Error('Product is not sold');
    }

    const user = await User.findById(product.soldTo);
    if (!user) {
        res.status(404);
        throw new Error('User who purchased this not found');
    }

    // 1. Add back balance
    user.balance += product.price;
    await user.save();

    // 2. Mark Product as UNSOLD or DELETE IT (usually we keep it but marked refunded)
    // For this app, let's mark it as isSold: false but maybe keep a history?
    // Actually, usually we just delete the product to clear it from "Sold" lists, 
    // OR we can add a 'status' field. Since we don't have 'status' on Product, 
    // let's just mark it isSold: false (restocking it) or mark it something else.
    // I'll mark it isSold = false and clear soldTo/soldAt.
    product.isSold = false;
    const oldSoldTo = product.soldTo;
    product.soldTo = undefined;
    product.soldAt = undefined;
    await product.save();

    // 3. Create Refund Transaction
    await Transaction.create({
        user: oldSoldTo,
        type: 'refund',
        amount: product.price,
        description: `Refund for ${product.type === 'card' ? 'Card ' + product.bin : 'Log ' + product.name}`,
        status: 'completed'
    });

    res.json({ success: true, message: 'Refund processed successfully' });
});

// @desc    Purchase multiple products in bulk
// @route   POST /api/orders/purchase-batch
// @access  Private
const purchaseBatch = asyncHandler(async (req, res) => {
    const { productIds } = req.body;
    const user = await User.findById(req.user._id);

    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
        res.status(400);
        throw new Error('No products selected');
    }

    const products = await Product.find({ _id: { $in: productIds } });

    if (products.length !== productIds.length) {
        res.status(404);
        throw new Error('Some products were not found');
    }

    const alreadySold = products.find(p => p.isSold);
    if (alreadySold) {
        res.status(400);
        throw new Error(`Product ${alreadySold.bin || alreadySold.name} is already sold`);
    }

    const totalCost = products.reduce((sum, p) => sum + p.price, 0);

    if (user.balance < totalCost) {
        res.status(400);
        throw new Error('Insufficient balance for bulk purchase');
    }

    // 1. Deduct Balance
    user.balance -= totalCost;
    await user.save();

    // 2. Mark Products as Sold & Create Transactions
    const purchasedProducts = [];
    for (const product of products) {
        product.isSold = true;
        product.soldTo = user._id;
        product.soldAt = Date.now();
        await product.save();

        const description = product.type === 'card'
            ? `Purchased Card ${product.bin} - ${product.brand} (Bulk)`
            : `Purchased Log: ${product.name} (Bulk)`;

        await Transaction.create({
            user: user._id,
            type: 'purchase',
            amount: product.price,
            description: description,
            status: 'completed'
        });

        purchasedProducts.push(product);
    }

    res.json({
        success: true,
        message: `${products.length} products purchased successfully!`,
        products: purchasedProducts
    });
});

export { purchaseProduct, purchaseBatch, getMyOrders, getAllOrders, refundProduct };
