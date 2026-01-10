import asyncHandler from 'express-async-handler';
import Ticket from '../models/ticketModel.js';

// @desc    Create new ticket
// @route   POST /api/tickets
// @access  Private
const createTicket = asyncHandler(async (req, res) => {
    const { subject, message, priority } = req.body;

    if (!subject || !message) {
        res.status(400);
        throw new Error('Please add a subject and message');
    }

    const ticket = await Ticket.create({
        user: req.user._id,
        subject,
        priority: priority || 'Medium',
        status: 'Open',
        messages: [{
            sender: 'User',
            message
        }]
    });

    res.status(201).json(ticket);
});

// @desc    Get user tickets
// @route   GET /api/tickets
// @access  Private
const getTickets = asyncHandler(async (req, res) => {
    const tickets = await Ticket.find({ user: req.user._id }).sort({ updatedAt: -1 });
    res.json(tickets);
});

// @desc    Get single ticket
// @route   GET /api/tickets/:id
// @access  Private
const getTicket = asyncHandler(async (req, res) => {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
        res.status(404);
        throw new Error('Ticket not found');
    }

    if (ticket.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
        res.status(401);
        throw new Error('Not authorized');
    }

    res.json(ticket);
});

// @desc    Reply to ticket
// @route   POST /api/tickets/:id/reply
// @access  Private
const replyTicket = asyncHandler(async (req, res) => {
    const { message } = req.body;
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
        res.status(404);
        throw new Error('Ticket not found');
    }

    if (ticket.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
        res.status(401);
        throw new Error('Not authorized');
    }

    const sender = req.user.isAdmin ? 'Admin' : 'User';

    ticket.messages.push({
        sender,
        message
    });

    if (req.user.isAdmin) {
        ticket.status = 'Answered';
    } else {
        ticket.status = 'Open';
    }

    await ticket.save();
    res.json(ticket);
});

// @desc    Get all tickets (Admin)
// @route   GET /api/tickets/admin/all
// @access  Private/Admin
const getAllTickets = asyncHandler(async (req, res) => {
    const tickets = await Ticket.find({}).populate('user', 'username email').sort({ updatedAt: -1 });
    res.json(tickets);
});

export { createTicket, getTickets, getTicket, replyTicket, getAllTickets };
