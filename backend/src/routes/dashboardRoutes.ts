import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware';
import { getAdminStats, getEmployeeStats } from '../controllers/dashboardController';

const router = express.Router();

router.get('/admin', protect, authorize(UserRole.ADMIN), getAdminStats);
router.get('/employee', protect, getEmployeeStats);

export default router;
