import express from 'express';
const router = express.Router();
import { createTicket, getTickets, getTicket, replyTicket, getAllTickets, updateTicket } from '../controllers/ticketController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/')
    .get(protect, getTickets)
    .post(protect, createTicket);

// Specific routes MUST come before parameterized routes
router.route('/admin/all')
    .get(protect, admin, getAllTickets);

router.route('/:id/reply')
    .post(protect, replyTicket);

router.route('/:id')
    .get(protect, getTicket)
    .put(protect, admin, updateTicket);

export default router;
