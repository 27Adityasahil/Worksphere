import { UserRole } from '../models/User';
import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware';
import {
  generatePayroll,
  getAllPayrolls,
  getMyPayrolls,
  updatePayrollStatus
} from '../controllers/payrollController';
const router = express.Router();
router.post('/', protect, authorize(UserRole.ADMIN), generatePayroll);
router.get('/', protect, authorize(UserRole.ADMIN), getAllPayrolls);
router.get('/me', protect, getMyPayrolls);
router.put('/:id/status', protect, authorize(UserRole.ADMIN), updatePayrollStatus);
export default router;
