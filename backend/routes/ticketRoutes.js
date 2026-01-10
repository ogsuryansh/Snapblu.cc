import express from 'express';
const router = express.Router();
import { createTicket, getTickets, getTicket, replyTicket, getAllTickets } from '../controllers/ticketController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/')
    .get(protect, getTickets)
    .post(protect, createTicket);

router.route('/admin/all')
    .get(protect, admin, getAllTickets);

router.route('/:id')
    .get(protect, getTicket);

router.route('/:id/reply')
    .post(protect, replyTicket);

export default router;
