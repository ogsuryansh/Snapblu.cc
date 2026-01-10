import mongoose from 'mongoose';

const ticketSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    subject: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ['Open', 'Answered', 'Closed'],
        default: 'Open'
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        default: 'Medium'
    },
    messages: [
        {
            sender: { type: String, required: true }, // 'User' or 'Admin'
            message: { type: String, required: true },
            createdAt: { type: Date, default: Date.now }
        }
    ]
}, {
    timestamps: true
});

const Ticket = mongoose.model('Ticket', ticketSchema);

export default Ticket;
