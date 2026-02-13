import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/productModel.js';

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected...');
    } catch (err) {
        console.error('MongoDB connection error:', err.message);
        process.exit(1);
    }
};

const countCards = async () => {
    await connectDB();

    try {
        const totalCards = await Product.countDocuments({});
        const soldCards = await Product.countDocuments({ isSold: true });
        const availableCards = await Product.countDocuments({ isSold: false });

        console.log(`Total Cards in Database: ${totalCards}`);
        console.log(`Sold Cards: ${soldCards}`);
        console.log(`Available Stock: ${availableCards}`);

        // Breakdown by price/category if needed
        const priceBreakdown = await Product.aggregate([
            { $group: { _id: "$price", count: { $sum: 1 } } },
            { $sort: { _id: 1 } }
        ]);

        console.log('\nBreakdown by Price:');
        priceBreakdown.forEach(p => {
            console.log(`$${p._id}: ${p.count} cards`);
        });

    } catch (error) {
        console.error('Error counting cards:', error);
    }

    process.exit(0);
};

countCards();
