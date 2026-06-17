import express from 'express';
import { createEmployee, getEmployees, getEmployeeById, updateEmployee } from '../controllers/employeeController';
import { protect, authorize } from '../middleware/authMiddleware';
import { UserRole } from '../models/User';
const router = express.Router();
router.use(protect); 
router.route('/')
  .get(getEmployees)
  .post(authorize(UserRole.ADMIN, UserRole.MANAGER), createEmployee);
router.route('/:id')
  .get(getEmployeeById)
  .put(authorize(UserRole.ADMIN, UserRole.MANAGER), updateEmployee);
export default router;
