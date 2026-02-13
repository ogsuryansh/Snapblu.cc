import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import Product from './models/productModel.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;
// Using the correct filenames provided by user
const FILES = [
    path.resolve('..', '1.txt'),
    path.resolve('..', '新建文本文档 (4).txt')
];
const PRICE = 7.00;

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
            headers: {
                'Accept-Version': '3'
            },
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
        return null;
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

    for (const filePath of FILES) {
        if (!fs.existsSync(filePath)) {
            console.error(`File not found: ${filePath}`);
            continue;
        }

        console.log(`\nProcessing file: ${path.basename(filePath)}`);
        const content = fs.readFileSync(filePath, 'utf-8');
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
                await new Promise(resolve => setTimeout(resolve, 800));
                console.log(`[${index + 1}/${lines.length}] Fetching BIN info for ${bin}...`);
                binInfo = await getBinInfo(bin);
                binCache.set(bin, binInfo);
            }

            // Mapping heuristic from prior files (pipe separated)
            // 0: CC, 1: MM, 2: YY, 3: CVV, 4: Name, 5: Addr, 6: City, 7: State, 8: Zip, 9: Country
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
                price: PRICE,
                category: 'usa', // Assuming USA based on context or file content usually
                batch: 'non-refundable',
                data: line.trim()
            });

            try {
                await product.save();
                totalImported++;
                console.log(`[${index + 1}] ✓ Added: ${bin}**** | ${binInfo.brand} | ${country} | $${PRICE}`);
            } catch (saveError) {
                console.error(`[${index + 1}] Failed to save card ${cardNumber}:`, saveError.message);
            }
        }
    }

    console.log(`\nImport completed! Successfully added ${totalImported} cards total.`);
    process.exit(0);
};

importData();
