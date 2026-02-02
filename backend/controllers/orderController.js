import asyncHandler from 'express-async-handler';
import Product from '../models/productModel.js';
import User from '../models/userModel.js';
import Transaction from '../models/transactionModel.js';

// @desc    Purchase a card
// @route   POST /api/orders/purchase/:id
// @access  Private
const purchaseProduct = asyncHandler(async (req, res) => {
    const productId = req.params.id;

    // 1. Pre-fetch check (Optional but good for UX)
    const product = await Product.findById(productId);
    if (!product) {
        res.status(404);
        throw new Error('Product not found');
    }
    if (product.isSold) {
        res.status(400);
        throw new Error('Product is already sold');
    }

    // 2. Check User Balance
    const user = await User.findById(req.user._id);
    if (user.balance < product.price) {
        res.status(400);
        throw new Error('Insufficient balance. Please deposit funds.');
    }

    // 3. Atomic Update: Try to mark as sold. Fails if isSold is already true.
    const updatedProduct = await Product.findOneAndUpdate(
        { _id: productId, isSold: false },
        {
            $set: {
                isSold: true,
                soldTo: user._id,
                soldAt: Date.now()
            }
        },
        { new: true }
    );

    if (!updatedProduct) {
        res.status(400);
        throw new Error('Product was just sold to another user. Please try another card.');
    }

    // 4. Deduct Balance
    // Since we successfully claimed the product, we deduct the balance.
    try {
        user.balance -= updatedProduct.price;
        await user.save();
    } catch (err) {
        // Critical error: Product sold but balance bad? 
        // We should revert the product sale if balance deduction fails (though unlikely if check passed)
        updatedProduct.isSold = false;
        updatedProduct.soldTo = undefined;
        updatedProduct.soldAt = undefined;
        await updatedProduct.save();
        res.status(500);
        throw new Error('Transaction failed. Balance not deducted.');
    }

    // 5. Create Transaction Record
    const description = updatedProduct.type === 'card'
        ? `Purchased Card ${updatedProduct.bin} - ${updatedProduct.brand}`
        : `Purchased Log: ${updatedProduct.name}`;

    await Transaction.create({
        user: user._id,
        type: 'purchase',
        amount: updatedProduct.price,
        description: description,
        status: 'completed'
    });

    res.json({
        success: true,
        message: 'Purchase successful!',
        product: {
            ...updatedProduct._doc,
            data: updatedProduct.data
        }
    });
});

// @desc    Get logged in user's purchased products
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
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

    const refundAmount = Number(product.price);
    user.balance = Math.round((user.balance + refundAmount) * 100) / 100;
    await user.save();

    product.isSold = false;
    const oldSoldTo = product.soldTo;
    product.soldTo = undefined;
    product.soldAt = undefined;
    await product.save();

    await Transaction.create({
        user: oldSoldTo,
        type: 'refund',
        amount: refundAmount,
        description: `Refund for ${product.type === 'card' ? 'Card ' + product.bin : 'Log ' + product.name}`,
        status: 'completed'
    });

    res.json({
        success: true,
        message: 'Refund processed successfully',
        refundAmount,
        newBalance: user.balance
    });
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

    // Check availability of ALL items first
    const productsToCheck = await Product.find({ _id: { $in: productIds } });

    // Check if any are already sold
    const alreadySold = productsToCheck.find(p => p.isSold);
    if (alreadySold) {
        res.status(400);
        throw new Error(`Product ${alreadySold.bin || alreadySold.name} is already sold`);
    }

    const totalCost = productsToCheck.reduce((sum, p) => sum + p.price, 0);

    if (user.balance < totalCost) {
        res.status(400);
        throw new Error('Insufficient balance for bulk purchase');
    }

    const purchasedProducts = [];

    // Process one by one atomically to ensure no partial failures with race conditions
    // If one fails (sold in between), we charge only for successful ones or fail operation?
    // Better to attempt to claim all.

    let actualTotalCost = 0;

    for (const id of productIds) {
        const updatedProduct = await Product.findOneAndUpdate(
            { _id: id, isSold: false },
            {
                $set: {
                    isSold: true,
                    soldTo: user._id,
                    soldAt: Date.now()
                }
            },
            { new: true }
        );

        if (updatedProduct) {
            purchasedProducts.push(updatedProduct);
            actualTotalCost += updatedProduct.price;

            // Log Transaction per item or bulk?
            const description = updatedProduct.type === 'card'
                ? `Purchased Card ${updatedProduct.bin} - ${updatedProduct.brand} (Bulk)`
                : `Purchased Log: ${updatedProduct.name} (Bulk)`;

            await Transaction.create({
                user: user._id,
                type: 'purchase',
                amount: updatedProduct.price,
                description: description,
                status: 'completed'
            });
        }
        // If failed (already sold), we just skip it.
    }

    if (purchasedProducts.length === 0) {
        res.status(400);
        throw new Error('All selected products were sold or unavailable.');
    }

    // Deduct only for what we actually got
    user.balance -= actualTotalCost;
    await user.save();

    res.json({
        success: true,
        message: `${purchasedProducts.length} products purchased successfully!`,
        products: purchasedProducts
    });
});

export { purchaseProduct, purchaseBatch, getMyOrders, getAllOrders, refundProduct };
