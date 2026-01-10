import asyncHandler from 'express-async-handler';
import Product from '../models/productModel.js';

// @desc    Fetch all available products
// @route   GET /api/products
// @access  Private
const getProducts = asyncHandler(async (req, res) => {
    // Determine if user is admin
    // In a real app, you might want a separate route for admin-list vs user-list
    // For now, we will assume this is the USER facing list, so we sanitize data.
    // If Admin wants to see all, we can check req.user.isAdmin

    // However, existing middleware puts user in req.user

    let products;
    if (req.user && req.user.isAdmin) {
        // Admin sees EVERYTHING
        products = await Product.find({});
    } else {
        // Users see only UNSOLD and SAFE fields
        // We exclude sensitive fields: cvv, name, email, phone, address (maybe keep city/state/zip), data
        // We mask cardNumber to last 4
        products = await Product.find({ isSold: false }).select('-data -cvv -name -email -phone -address');
    }

    // Mask card numbers for non-admins (or processed on frontend, but better here)
    const sanitizedProducts = products.map(p => {
        if (req.user && req.user.isAdmin) return p;

        const pObj = p.toObject();
        // Mask Card Number: ************1234
        if (pObj.cardNumber && pObj.cardNumber.length > 4) {
            pObj.cardNumber = '************' + pObj.cardNumber.slice(-4);
        }
        return pObj;
    });

    res.json(sanitizedProducts);
});

// @desc    Add a product
// @route   POST /api/products
// @access  Private/Admin
const addProduct = asyncHandler(async (req, res) => {
    const {
        type,
        bin,
        cardNumber,
        exp,
        cvv,
        name,
        email,
        phone,
        address,
        zip,
        city,
        state,
        country,
        brand,
        level,
        issuer,
        price,
        data
    } = req.body;

    // Helper to default to UNKNOWN if empty
    const def = (val) => (!val || val.trim() === '') ? 'UNKNOWN' : val;

    // Construct the 'data' field automatically if not provided
    const safeCard = def(cardNumber);
    const safeExp = def(exp);
    const safeCvv = def(cvv);
    const safeName = def(name);
    const safeEmail = def(email);
    const safePhone = def(phone);
    const safeAddress = def(address);
    const safeCity = def(city);
    const safeState = def(state);
    const safeZip = def(zip);
    const safeCountry = def(country);

    const fullData = data || `${safeCard}|${safeExp}|${safeCvv}|${safeName}|${safeAddress}|${safeCity}|${safeZip}|${safeState}|${safeCountry}|${safePhone}|${safeEmail}`;

    const product = new Product({
        type,
        bin,
        cardNumber: safeCard,
        exp: safeExp,
        cvv: safeCvv,
        name: safeName,
        email: safeEmail,
        phone: safePhone,
        address: safeAddress,
        zip: safeZip,
        city: safeCity,
        state: safeState,
        country: safeCountry,
        brand,
        level,
        issuer,
        price,
        data: fullData
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
        await product.deleteOne();
        res.json({ message: 'Product removed' });
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

export { getProducts, addProduct, deleteProduct };
