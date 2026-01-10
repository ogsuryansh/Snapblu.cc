import express from 'express';
const router = express.Router();
import { getSettings, updateSettings } from '../controllers/settingController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/')
    .get(getSettings) // Public read
    .put(protect, admin, updateSettings); // Admin write

export default router;
