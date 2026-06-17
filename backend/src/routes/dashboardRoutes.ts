import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware';
import { getAdminStats, getEmployeeStats } from '../controllers/dashboardController';

const router = express.Router();

router.get('/admin', protect, authorize('Admin'), getAdminStats);
router.get('/employee', protect, getEmployeeStats);

export default router;
