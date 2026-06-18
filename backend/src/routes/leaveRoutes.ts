import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware';
import {
  submitLeaveRequest,
  getMyLeaves,
  getAllLeaves,
  updateLeaveStatus
} from '../controllers/leaveController';
const router = express.Router();
router.post('/', protect, submitLeaveRequest);
router.get('/me', protect, getMyLeaves);
router.get('/', protect, authorize(UserRole.ADMIN), getAllLeaves);
router.put('/:id/status', protect, authorize(UserRole.ADMIN), updateLeaveStatus);
export default router;
