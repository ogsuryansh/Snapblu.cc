import express from 'express';
import {
    authUser,
    registerUser,
    verifyEmail,
    getUsers,
    deleteUser,
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(registerUser).get(protect, admin, getUsers);
router.post('/login', authUser);
router.get('/verify/:token', verifyEmail);
router.delete('/:id', protect, admin, deleteUser);

export default router;
