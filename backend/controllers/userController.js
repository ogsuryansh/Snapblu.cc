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
    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    if (user && (await user.matchPassword(password))) {
        // TEMPORARILY DISABLED: Email verification check
        /*
        if (!user.isVerified) {
            res.status(401);
            throw new Error('Please verify your email address before logging in.');
        }
        */

        res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
            isAdmin: user.isAdmin,
            balance: user.balance,
            token: generateToken(user._id),
        });
    } else {
        console.log(`Failed login attempt for: ${email}`);
        res.status(401);
        throw new Error('Invalid email or password');
    }
});

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;
    const normalizedEmail = email.toLowerCase().trim();
    const userExists = await User.findOne({ email: normalizedEmail });

    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    const verificationToken = crypto.randomBytes(20).toString('hex');

    const user = await User.create({
        username,
        email: normalizedEmail,
        password,
        verificationToken,
        isVerified: true, // TEMPORARILY: Set to true by default
    });

    if (user) {
        // Send Verification Email with dynamic URL
        const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify-email/${verificationToken}`;

        // Professional HTML Email Template
        const message = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Email - Snapblu.cc</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Arial', 'Helvetica', sans-serif; background-color: #0a0a0a; color: #ffffff;">
    <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #0a0a0a;">
        <tr>
            <td align="center" style="padding: 40px 20px;">
                <table role="presentation" style="width: 100%; max-width: 600px; border-collapse: collapse; background: linear-gradient(135deg, #111111 0%, #1a1a1a 100%); border-radius: 16px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.5);">
                    
                    <!-- Header with Logo -->
                    <tr>
                        <td style="background: linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%); padding: 40px 30px; text-align: center;">
                            <div style="width: 60px; height: 60px; background: rgba(255,255,255,0.15); border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 16px;">
                                <span style="font-size: 32px; color: white;">🛡️</span>
                            </div>
                            <h1 style="margin: 0; color: white; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">Snapblu.cc</h1>
                            <p style="margin: 8px 0 0 0; color: rgba(255,255,255,0.9); font-size: 14px; font-weight: 500;">Secure Digital Solutions</p>
                        </td>
                    </tr>

                    <!-- Main Content -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            <h2 style="margin: 0 0 16px 0; color: #ffffff; font-size: 24px; font-weight: 600;">Welcome, ${user.username}! 👋</h2>
                            <p style="margin: 0 0 24px 0; color: #a3a3a3; font-size: 16px; line-height: 1.6;">
                                Thank you for choosing Snapblu.cc. We're excited to have you on board! To get started and access all features, please verify your email address.
                            </p>

                            <!-- CTA Button -->
                            <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 32px 0;">
                                <tr>
                                    <td align="center">
                                        <a href="${verificationUrl}" style="display: inline-block; padding: 16px 48px; background: linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%); color: white; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 14px rgba(59, 130, 246, 0.4); transition: all 0.3s ease;">
                                            ✓ Verify Email Address
                                        </a>
                                    </td>
                                </tr>
                            </table>

                            <!-- Alternative Link -->
                            <div style="margin: 32px 0; padding: 20px; background-color: rgba(255,255,255,0.03); border-left: 4px solid #3b82f6; border-radius: 4px;">
                                <p style="margin: 0 0 8px 0; color: #737373; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                                    Button not working?
                                </p>
                                <p style="margin: 0; color: #a3a3a3; font-size: 14px; line-height: 1.5; word-break: break-all;">
                                    Copy and paste this link into your browser:<br/>
                                    <a href="${verificationUrl}" style="color: #3b82f6; text-decoration: underline;">${verificationUrl}</a>
                                </p>
                            </div>

                            <!-- Security Notice -->
                            <div style="margin: 32px 0 0 0; padding: 16px; background-color: rgba(251, 191, 36, 0.1); border: 1px solid rgba(251, 191, 36, 0.3); border-radius: 8px;">
                                <p style="margin: 0; color: #fbbf24; font-size: 13px; line-height: 1.5;">
                                    ⏱️ <strong>Important:</strong> This verification link expires in 24 hours for security reasons.
                                </p>
                            </div>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="padding: 30px; background-color: rgba(0,0,0,0.3); text-align: center; border-top: 1px solid rgba(255,255,255,0.1);">
                            <p style="margin: 0 0 12px 0; color: #737373; font-size: 13px; line-height: 1.5;">
                                If you didn't create an account with Snapblu.cc, please ignore this email.
                            </p>
                            <div style="margin: 16px 0;">
                                <a href="#" style="color: #3b82f6; text-decoration: none; font-size: 13px; margin: 0 12px;">Help Center</a>
                                <span style="color: #404040;">•</span>
                                <a href="#" style="color: #3b82f6; text-decoration: none; font-size: 13px; margin: 0 12px;">Privacy Policy</a>
                                <span style="color: #404040;">•</span>
                                <a href="#" style="color: #3b82f6; text-decoration: none; font-size: 13px; margin: 0 12px;">Terms</a>
                            </div>
                            <p style="margin: 16px 0 0 0; color: #525252; font-size: 12px;">
                                © 2026 Snapblu.cc. All rights reserved.
                            </p>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
</html>
        `;

        try {
            await sendEmail({
                email: user.email,
                subject: '🔐 Verify Your Email - Snapblu.cc',
                message,
            });

            res.status(201).json({
                _id: user._id,
                username: user.username,
                email: user.email,
                isAdmin: user.isAdmin,
                balance: user.balance,
                token: generateToken(user._id),
                message: `Registration successful!`,
            });
        } catch (error) {
            console.error("Email send error:", error);
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

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        await user.deleteOne();
        res.json({ message: 'User removed successfully' });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Update user balance
// @route   PUT /api/users/:id/balance
// @access  Private/Admin
const updateUserBalance = asyncHandler(async (req, res) => {
    const { balance } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    if (typeof balance !== 'number' || balance < 0) {
        res.status(400);
        throw new Error('Invalid balance amount');
    }

    user.balance = balance;
    await user.save();

    res.json({ message: 'Balance updated successfully', user });
});

// @desc    Get current user details
// @route   GET /api/users/me
// @access  Private
const getCurrentUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select('-password');

    if (user) {
        res.json(user);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

export { authUser, registerUser, verifyEmail, getUsers, deleteUser, updateUserBalance, getCurrentUser };

