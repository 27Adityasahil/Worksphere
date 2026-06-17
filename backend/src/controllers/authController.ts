import { Request, Response } from 'express';
import User from '../models/User';
import generateToken from '../utils/generateToken';
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password').populate('employeeProfile');
    if (user && (await user.comparePassword(password))) {
      generateToken(res, user._id.toString());
      res.status(200).json({
        success: true,
        data: {
          _id: user._id,
          email: user.email,
          role: user.role,
          isFirstLogin: user.isFirstLogin,
          employeeProfile: user.employeeProfile
        }
      });
    } else {
      res.status(401).json({ success: false, error: 'Invalid email or password' });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};
export const logoutUser = async (req: Request, res: Response): Promise<void> => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0)
  });
  res.status(200).json({ success: true, message: 'Logged out successfully' });
};
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, tempPassword, newPassword } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (user && (await user.comparePassword(tempPassword))) {
      user.password = newPassword;
      user.isFirstLogin = false;
      await user.save();
      generateToken(res, user._id.toString());
      res.status(200).json({
        success: true,
        message: 'Password reset successful',
        data: {
          _id: user._id,
          email: user.email,
          role: user.role,
          isFirstLogin: user.isFirstLogin
        }
      });
    } else {
      res.status(401).json({ success: false, error: 'Invalid email or temporary password' });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};
