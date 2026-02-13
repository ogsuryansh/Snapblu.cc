import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import Product from './models/productModel.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

// Configuration
const BATCHES = [
    {
        file: path.resolve('..', 'Usa live .txt'),
        price: 8.00,
        category: 'usa-live'
    },
    {
        file: path.resolve('..', 'Usa mix.txt'),
        price: 3.50,
        category: 'usa-mix'
    }
];

const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('MongoDB Connected...');
    } catch (err) {
        console.error('MongoDB connection error:', err.message);
        process.exit(1);
    }
};

const getBinInfo = async (bin) => {
    try {
        const { data } = await axios.get(`https://lookup.binlist.net/${bin.substring(0, 6)}`, {
            headers: { 'Accept-Version': '3' },
            timeout: 5000
        });
        return {
            brand: (data.scheme || 'UNKNOWN').toUpperCase(),
            level: (data.brand || 'CLASSIC').toUpperCase(),
            issuer: (data.bank?.name || 'UNKNOWN BANK').toUpperCase(),
            country: (data.country?.alpha2 || 'US').toUpperCase(),
            type: (data.type || 'CREDIT').toUpperCase()
        };
    } catch (error) {
        return {
            brand: 'VISA',
            level: 'CLASSIC',
            issuer: 'UNKNOWN',
            country: 'US',
            type: 'CREDIT'
        };
    }
};

const parseLine = (line) => {
    let parts = [];
    const trimmed = line.trim();
    if (trimmed.includes('|')) {
        parts = trimmed.split('|');
    } else if (trimmed.includes('\t')) {
        parts = trimmed.split('\t');
    } else {
        return null; // or try spaces if consistent
    }

    // Basic cleanup
    parts = parts.map(p => p.trim());

    // We expect at least CC, MM, YY, CVV (4 parts)
    if (parts.length < 4) return null;

    return parts;
};

const importData = async () => {
    await connectDB();

    const binCache = new Map();
    let totalImported = 0;

    for (const batch of BATCHES) {
        if (!fs.existsSync(batch.file)) {
            console.error(`File not found: ${batch.file}`);
            continue;
        }

        console.log(`\nProcessing file: ${path.basename(batch.file)} at $${batch.price}`);
        const content = fs.readFileSync(batch.file, 'utf-8');
        const lines = content.split('\n').filter(line => line.trim() !== '');

        console.log(`Found ${lines.length} lines.`);

        for (const [index, line] of lines.entries()) {
            const parts = parseLine(line);
            if (!parts) {
                console.log(`[${index + 1}] Skipping invalid line format`);
                continue;
            }

            const cardNumber = parts[0];
            if (!cardNumber || cardNumber.length < 13) {
                // Check if it's potentially merged lines (seen in Usa live .txt)
                // e.g. ...|email|IP 518725...
                // This basic parser won't handle multiple cards on one line unless we split by pattern, 
                // but for now we follow standard structure. The user file 'Usa live .txt' lines 3, 7, 8, etc seem 
                // to have multiple cards on single lines or just bad formatting. 
                // We will skip complex multi-card lines for safety unless they match standard delimiters.
                console.log(`[${index + 1}] Skipping invalid CC: ${cardNumber}`);
                continue;
            }

            const bin = cardNumber.substring(0, 6);

            // Check for duplicates
            const exists = await Product.findOne({ cardNumber: cardNumber });
            if (exists) {
                console.log(`[${index + 1}] Skipping duplicate: ${bin}****`);
                continue;
            }

            let binInfo;
            if (binCache.has(bin)) {
                binInfo = binCache.get(bin);
            } else {
                await new Promise(resolve => setTimeout(resolve, 800)); // Rate limit
                console.log(`[${index + 1}/${lines.length}] Fetching BIN info for ${bin}...`);
                binInfo = await getBinInfo(bin);
                binCache.set(bin, binInfo);
            }

            // Mapping heuristic based on files:
            // Mix: CC|MM|YY|CVV|Name|Addr|City|State|Zip|Country|Phone|Email|IP
            const exp = `${parts[1]}/${parts[2]}`;
            const cvv = parts[3];
            const name = parts[4] || 'UNKNOWN';

            const address = parts[5] || 'UNKNOWN';
            const city = parts[6] || 'UNKNOWN';
            const state = parts[7] || 'UNKNOWN';
            const zip = parts[8] || 'UNKNOWN';
            const countryRaw = parts[9] || 'US';
            const country = (countryRaw.toUpperCase() === 'UNITED STATES' || countryRaw.toUpperCase() === 'US') ? 'US' : countryRaw.toUpperCase();

            const phone = parts[10] || 'UNKNOWN';
            const email = parts[11] || 'UNKNOWN';

            const product = new Product({
                type: 'card',
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
                brand: binInfo.brand,
                level: binInfo.level,
                issuer: binInfo.issuer,
                price: batch.price,
                category: batch.category,
                batch: 'non-refundable',
                data: line.trim()
            });

            try {
                await product.save();
                totalImported++;
                console.log(`[${index + 1}] ✓ Added: ${bin}**** | $${batch.price}`);
            } catch (saveError) {
                console.error(`[${index + 1}] Failed to save card ${cardNumber}:`, saveError.message);
            }
        }
    }

    console.log(`\nImport completed! Successfully added ${totalImported} cards total.`);
    process.exit(0);
};

importData();
