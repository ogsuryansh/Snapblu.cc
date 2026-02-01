import mongoose from 'mongoose';

const productSchema = mongoose.Schema({
    type: {
        type: String,
        required: true,
        default: 'card'
    },
    // Card Specific Fields
    bin: { type: String },
    cardNumber: { type: String, required: true },
    exp: { type: String, default: 'UNKNOWN' },
    cvv: { type: String, default: 'UNKNOWN' },
    name: { type: String, default: 'UNKNOWN' },
    email: { type: String, default: 'UNKNOWN' },
    phone: { type: String, default: 'UNKNOWN' },
    address: { type: String, default: 'UNKNOWN' },
    city: { type: String, default: 'UNKNOWN' },
    state: { type: String, default: 'UNKNOWN' },
    zip: { type: String, default: 'UNKNOWN' },
    country: { type: String, default: 'UNKNOWN' }, // Changed from US to modify if needed, or keep US if preferred. User said "add that UNKNOWN". I'll stick to UNKNOWN.

    brand: { type: String },
    level: { type: String },
    issuer: { type: String },

    // Log/Account Specific Fields
    category: { type: String },
    description: { type: String },

    // Batch System
    batch: {
        type: String,
        required: true,
        enum: ['refundable', 'non-refundable'],
        default: 'non-refundable'
    },

    // Core details
    price: {
        type: Number,
        required: true,
        default: 0.85
    },
    data: {
        type: String,
        required: true
    }, // Full card info (PAN|EXP|CVV etc)

    // Status
    isSold: {
        type: Boolean,
        required: true,
        default: false
    },
    soldTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    soldAt: {
        type: Date
    },
}, {
    timestamps: true,
});

const Product = mongoose.model('Product', productSchema);

export default Product;
