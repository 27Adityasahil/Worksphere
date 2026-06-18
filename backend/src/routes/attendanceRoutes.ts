import { UserRole } from '../models/User';
import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware';
import {
  clockIn,
  clockOut,
  getMyAttendance,
  getAllAttendance,
  getViolations
} from '../controllers/attendanceController';
const router = express.Router();
router.post('/clock-in', protect, clockIn);
router.put('/clock-out', protect, clockOut);
router.get('/me', protect, getMyAttendance);
router.get('/violations', protect, authorize(UserRole.ADMIN), getViolations);
router.get('/', protect, authorize(UserRole.ADMIN), getAllAttendance);
export default router;
