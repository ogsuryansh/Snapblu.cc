import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';
import sendEmail from '../utils/sendEmail.js';
import crypto from 'crypto';

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        if (!user.isVerified) {
            res.status(401);
            throw new Error('Please verify your email address before logging in.');
        }

        res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
            isAdmin: user.isAdmin,
            balance: user.balance,
            token: generateToken(user._id),
        });
    } else {
        res.status(401);
        throw new Error('Invalid email or password');
    }
});

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    const verificationToken = crypto.randomBytes(20).toString('hex');

    const user = await User.create({
        username,
        email,
        password,
        verificationToken,
    });

    if (user) {
        // Send Verification Email
        // Assuming frontend runs on port 5173
        const verificationUrl = `http://localhost:5173/verify-email/${verificationToken}`;

        // DEV: Log link to console
        console.log('-------------------------------------------------------');
        console.log(`VERIFY LINK: ${verificationUrl}`);
        console.log('-------------------------------------------------------');

        const message = `
            <h2>Hello ${user.username},</h2>
            <p>Please verify your email address to activate your account on Snapblu.cc.</p>
            <p><a href="${verificationUrl}" style="background-color: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verify Email</a></p>
            <p>Or click this link: <a href="${verificationUrl}">${verificationUrl}</a></p>
            <p>This link is valid for 24 hours.</p>
        `;

        try {
            await sendEmail({
                email: user.email,
                subject: 'Snapblu Registration - Verify Email',
                message,
            });

            res.status(201).json({
                message: `Registration successful! Verification email sent to ${user.email}`,
            });
        } catch (error) {
            console.error("Email send error:", error);
            // Delete user if email fails so they can try again? Or just throw error.
            // For now, let's keep user but warn logic.
            res.status(500);
            throw new Error('Email could not be sent. Please contact support.');
        }

    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});

// @desc    Verify user email
// @route   GET /api/users/verify/:token
// @access  Public
// @desc    Verify user email
// @route   GET /api/users/verify/:token
// @access  Public
const verifyEmail = asyncHandler(async (req, res) => {
    const token = req.params.token;
    console.log(`[Verify] Request received for token: ${token}`);

    const user = await User.findOne({ verificationToken: token });

    if (!user) {
        console.log(`[Verify] FAIL! No user found with token: ${token}`);
        res.status(400);
        throw new Error('Invalid or expired verification token');
    }

    console.log(`[Verify] User found: ${user.username} (${user.email}). Attempting to save...`);

    try {
        user.isVerified = true;
        user.verificationToken = undefined;
        await user.save();
        console.log('[Verify] SUCCESS! User saved.');
        res.json({ message: 'Email verified successfully! You can now login.' });
    } catch (saveError) {
        console.error('[Verify] SAVE ERROR:', saveError);
        res.status(500);
        throw new Error(`DB Save Failed: ${saveError.message}`);
    }
});

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find({});
    res.json(users);
});

export { authUser, registerUser, verifyEmail, getUsers };

