import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/userModel.js';
import connectDB from './config/db.js';

dotenv.config();

const destroyData = async () => {
    try {
        await connectDB();
        await User.deleteMany();
        console.log('✅ All Users Deleted!');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

destroyData();
