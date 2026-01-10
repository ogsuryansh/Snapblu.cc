import mongoose from 'mongoose';

const depositSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    amount: {
        type: Number,
        required: true,
    },
    transactionId: {
        type: String,
        required: true,
    },
    method: {
        type: String,
        default: 'Crypto',
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
    },
}, {
    timestamps: true,
});

const Deposit = mongoose.model('Deposit', depositSchema);

export default Deposit;
