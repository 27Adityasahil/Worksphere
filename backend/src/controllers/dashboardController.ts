import { Request, Response } from 'express';
import EmployeeProfile from '../models/EmployeeProfile';
import Attendance from '../models/Attendance';
import LeaveRequest from '../models/LeaveRequest';
import AttendanceViolation from '../models/AttendanceViolation';
import { AuthRequest } from '../middleware/authMiddleware';

export const getAdminStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const totalEmployees = await EmployeeProfile.countDocuments();

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const todayAttendance = await Attendance.countDocuments({
      date: { $gte: startOfDay, $lte: endOfDay },
      status: { $in: ['Present', 'Late'] }
    });

    const pendingLeaves = await LeaveRequest.countDocuments({
      status: 'Pending'
    });

    const recentViolations = await AttendanceViolation.find()
      .sort({ attemptTime: -1 })
      .limit(5)
      .populate({
        path: 'user',
        select: 'email',
        populate: {
          path: 'employeeProfile',
          select: 'firstName lastName employeeId'
        }
      });

    res.status(200).json({
      success: true,
      data: {
        totalEmployees,
        todayAttendance,
        pendingLeaves,
        recentViolations
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getEmployeeStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const todayAttendance = await Attendance.findOne({
      user: userId,
      date: { $gte: startOfDay, $lte: endOfDay }
    });

    const approvedLeaves = await LeaveRequest.countDocuments({
      user: userId,
      status: 'Approved'
    });

    const pendingLeaves = await LeaveRequest.countDocuments({
      user: userId,
      status: 'Pending'
    });

    res.status(200).json({
      success: true,
      data: {
        todayAttendanceStatus: todayAttendance ? todayAttendance.status : 'Not Clocked In',
        approvedLeaves,
        pendingLeaves
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};
