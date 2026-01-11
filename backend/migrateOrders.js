import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/productModel.js';
import connectDB from './config/db.js';

dotenv.config();

// Connect to Database
connectDB();

const backfillSoldAt = async () => {
    try {
        console.log('🔄 Starting soldAt backfill migration...');

        // Find all sold products that don't have a soldAt field
        const soldProductsWithoutDate = await Product.find({
            isSold: true,
            soldAt: { $exists: false }
        });

        console.log(`📊 Found ${soldProductsWithoutDate.length} sold products without soldAt timestamp`);

        if (soldProductsWithoutDate.length === 0) {
            console.log('✅ No products need updating. All sold products have soldAt timestamps.');
            process.exit(0);
        }

        // Update each product to set soldAt to updatedAt (best approximation we have)
        let updated = 0;
        for (const product of soldProductsWithoutDate) {
            product.soldAt = product.updatedAt || product.createdAt;
            await product.save();
            updated++;
            console.log(`✅ Updated product ${product._id} - BIN: ${product.bin}`);
        }

        console.log(`\n🎉 Migration complete! Updated ${updated} products.`);
        process.exit(0);
    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
};

backfillSoldAt();
