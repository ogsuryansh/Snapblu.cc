import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/userModel.js';
import connectDB from './config/db.js';

dotenv.config();

const makeAdmin = async () => {
    try {
        await connectDB();

        // CHANGE THIS EMAIL TO YOURS IF DIFFERENT
        const email = 'auraff4208@gmail.com';

        const user = await User.findOne({ email });

        if (user) {
            user.isAdmin = true;
            await user.save();
            console.log(`✅ User ${user.username} is now an Admin!`);
        } else {
            console.log('❌ User not found!');
        }

        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

makeAdmin();
