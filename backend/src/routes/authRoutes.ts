import express from 'express';
import { loginUser, logoutUser, resetPassword } from '../controllers/authController';
const router = express.Router();
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.post('/reset-password', resetPassword);
export default router;
