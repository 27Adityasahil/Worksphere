import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware';
import { getSettings, updateSettings } from '../controllers/settingsController';
const router = express.Router();
router.get('/', protect, getSettings);
router.put('/', protect, authorize('Admin'), updateSettings);
export default router;
