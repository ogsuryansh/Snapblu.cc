import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/productModel.js';

dotenv.config();

const deleteCards = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected successfully.');

        const pricesToDelete = [0.8, 0.4];
        
        console.log(`Searching for products with prices: ${pricesToDelete.join(', ')}...`);
        
        // Count before deletion for verification
        const countBefore = await Product.countDocuments({
            price: { $in: pricesToDelete }
        });

        if (countBefore === 0) {
            console.log('No products found matching the criteria.');
        } else {
            console.log(`Found ${countBefore} products. Deleting...`);
            
            const result = await Product.deleteMany({
                price: { $in: pricesToDelete }
            });
            
            console.log(`Successfully deleted ${result.deletedCount} products.`);
        }

        await mongoose.connection.close();
        console.log('Database connection closed.');
        process.exit(0);
    } catch (error) {
        console.error('Error during deletion:', error);
        process.exit(1);
    }
};

deleteCards();
