import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware';
import {
  generatePayroll,
  getAllPayrolls,
  getMyPayrolls,
  updatePayrollStatus
} from '../controllers/payrollController';
const router = express.Router();
router.post('/', protect, authorize('Admin'), generatePayroll);
router.get('/', protect, authorize('Admin'), getAllPayrolls);
router.get('/me', protect, getMyPayrolls);
router.put('/:id/status', protect, authorize('Admin'), updatePayrollStatus);
export default router;
