import asyncHandler from 'express-async-handler';
import Setting from '../models/settingModel.js';

// @desc    Get site settings (public)
// @route   GET /api/settings
// @access  Public
const getSettings = asyncHandler(async (req, res) => {
    let settings = await Setting.findOne();

    if (!settings) {
        // Create default if doesn't exist
        settings = await Setting.create({
            btcAddress: 'Pending Setup'
        });
    }

    res.json(settings);
});

// @desc    Update site settings
// @route   PUT /api/settings
// @access  Private/Admin
const updateSettings = asyncHandler(async (req, res) => {
    const {
        btcAddress,
        ltcAddress,
        usdtAddress,
        ethAddress,
        solAddress,
        trxAddress,
        xrpAddress,
        xmrAddress,
        dogeAddress
    } = req.body;

    let settings = await Setting.findOne();

    if (settings) {
        if (btcAddress !== undefined) settings.btcAddress = btcAddress;
        if (ltcAddress !== undefined) settings.ltcAddress = ltcAddress;
        if (usdtAddress !== undefined) settings.usdtAddress = usdtAddress;
        if (ethAddress !== undefined) settings.ethAddress = ethAddress;
        if (solAddress !== undefined) settings.solAddress = solAddress;
        if (trxAddress !== undefined) settings.trxAddress = trxAddress;
        if (xrpAddress !== undefined) settings.xrpAddress = xrpAddress;
        if (xmrAddress !== undefined) settings.xmrAddress = xmrAddress;
        if (dogeAddress !== undefined) settings.dogeAddress = dogeAddress;

        settings.updatedBy = req.user._id;

        const updatedSettings = await settings.save();
        res.json(updatedSettings);
    } else {
        const newSettings = await Setting.create({
            btcAddress,
            ltcAddress,
            usdtAddress,
            ethAddress,
            solAddress,
            trxAddress,
            xrpAddress,
            xmrAddress,
            dogeAddress,
            updatedBy: req.user._id
        });
        res.status(201).json(newSettings);
    }
});

export { getSettings, updateSettings };
