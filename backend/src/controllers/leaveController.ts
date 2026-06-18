import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import LeaveRequest, { LeaveStatus } from '../models/LeaveRequest';
export const submitLeaveRequest = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { leaveType, startDate, endDate, reason } = req.body;
    if (!leaveType || !startDate || !endDate || !reason) {
      res.status(400).json({ success: false, error: 'Please provide all required fields' });
      return;
    }
    if (new Date(startDate) > new Date(endDate)) {
      res.status(400).json({ success: false, error: 'End date must be after start date' });
      return;
    }
    const leaveRequest = await LeaveRequest.create({
      user: req.user?._id,
      leaveType,
      startDate,
      endDate,
      reason,
      status: LeaveStatus.PENDING
    });
    res.status(201).json({ success: true, data: leaveRequest });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};
export const getMyLeaves = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const leaves = await LeaveRequest.find({ user: req.user?._id }).sort('-createdAt');
    res.status(200).json({ success: true, count: leaves.length, data: leaves });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};
export const getAllLeaves = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const leaves = await LeaveRequest.find()
      .populate({
        path: 'user',
        select: 'email',
        populate: {
          path: 'employeeProfile',
          select: 'firstName lastName employeeId department'
        }
      })
      .sort('-createdAt');
    res.status(200).json({ success: true, count: leaves.length, data: leaves });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};
export const updateLeaveStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status, adminComment } = req.body;
    if (!Object.values(LeaveStatus).includes(status)) {
      res.status(400).json({ success: false, error: 'Invalid status' });
      return;
    }
    const leaveRequest = await LeaveRequest.findById(req.params.id);
    if (!leaveRequest) {
      res.status(404).json({ success: false, error: 'Leave request not found' });
      return;
    }
    leaveRequest.status = status;
    if (adminComment) {
      leaveRequest.adminComment = adminComment;
    }
    await leaveRequest.save();
    res.status(200).json({ success: true, data: leaveRequest });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};
