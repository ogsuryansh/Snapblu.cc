import asyncHandler from 'express-async-handler';
import Product from '../models/productModel.js';
import axios from 'axios';

// @desc    Fetch all available products
// @route   GET /api/products
// @access  Private
const getProducts = asyncHandler(async (req, res) => {
    let products;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10000; // Large default for backward compatibility
    const skip = (page - 1) * limit;

    let query = {};
    if (!(req.user && req.user.isAdmin)) {
        query.isSold = false;
    }

    // Filter by type if provided
    if (req.query.type) {
        query.type = req.query.type;
    }

    const total = await Product.countDocuments(query);

    products = await Product.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    const sanitizedProducts = products.map(p => {
        if (req.user && req.user.isAdmin) return p;

        const pObj = p.toObject();

        // Always remove sensitive 'data' field for users
        delete pObj.data;

        if (pObj.type === 'card') {
            // Mask Card Number and remove sensitive PII
            if (pObj.cardNumber && pObj.cardNumber.length > 4) {
                pObj.cardNumber = '************' + pObj.cardNumber.slice(-4);
            }
            delete pObj.cvv;
            delete pObj.name;
            delete pObj.email;
            delete pObj.phone;
            delete pObj.address;
        }

        return pObj;
    });

    res.json({
        products: sanitizedProducts,
        page,
        pages: Math.ceil(total / limit),
        total
    });
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
        data,
        category,
        description
    } = req.body;

    let product;

    if (type === 'card') {
        // Helper to default to UNKNOWN if empty
        const def = (val) => (!val || val.trim() === '') ? 'UNKNOWN' : val;

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

        product = new Product({
            type: 'card',
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
    } else {
        // Log/Account or Bulk
        product = new Product({
            type: type === 'log' ? 'log' : 'bulk',
            cardNumber: name || (type === 'log' ? 'Unknown Log' : 'Unknown Bulk'), // Reusing cardNumber field for Title
            name: name || (type === 'log' ? 'Unknown Log' : 'Unknown Bulk'),
            category,
            description,
            price,
            data, // The credentials or cards list
        });
    }

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

// @desc    Check BIN info
// @route   POST /api/products/check-bin
// @access  Private
const checkBin = asyncHandler(async (req, res) => {
    const { bin } = req.body;
    if (!bin || bin.length < 6) {
        res.status(400);
        throw new Error('Please provide a valid 6-digit BIN');
    }

    try {
        const { data } = await axios.get(`https://lookup.binlist.net/${bin.substring(0, 6)}`);
        res.json({
            success: true,
            bin: bin,
            brand: data.scheme || 'UNKNOWN',
            type: data.type || 'UNKNOWN',
            level: data.brand || 'UNKNOWN',
            bank: data.bank?.name || 'UNKNOWN',
            country: data.country?.name || 'UNKNOWN',
            flag: data.country?.emoji || ''
        });
    } catch (error) {
        // Fallback for when binlist is down or BIN not found
        res.json({
            success: false,
            message: 'BIN info not found in database',
            bin: bin
        });
    }
});

// @desc    Check Card status (Live/Dead)
// @route   POST /api/products/check-card
// @access  Private
const checkCard = asyncHandler(async (req, res) => {
    // In a production environment, this would call a real CC checker API
    // For this demonstration, we simulate a professional checker with a realistic delay

    // Simulate network delay for checking
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000));

    // Simulation logic: 95% chance of being LIVE for testing
    const isLive = Math.random() > 0.05;

    if (isLive) {
        res.json({
            success: true,
            status: 'LIVE',
            message: 'Card is authorized and active.',
            code: '00'
        });
    } else {
        res.json({
            success: false,
            status: 'DEAD',
            message: 'Card was declined by issuer.',
            code: '05'
        });
    }
});

export { getProducts, addProduct, deleteProduct, checkBin, checkCard };
