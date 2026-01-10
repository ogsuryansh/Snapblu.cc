import express from 'express';
import {
    authUser,
    registerUser,
    verifyEmail,
    getUsers,
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(registerUser).get(protect, admin, getUsers);
router.post('/login', authUser);
router.get('/verify/:token', verifyEmail);

export default router;
