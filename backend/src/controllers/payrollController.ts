import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import Payroll from '../models/Payroll';
export const generatePayroll = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { user, month, year, basicSalary, allowances, deductions } = req.body;
    if (!user || !month || !year || basicSalary === undefined) {
      res.status(400).json({ success: false, error: 'Please provide user, month, year, and basicSalary' });
      return;
    }
    const netSalary = basicSalary + (allowances || 0) - (deductions || 0);
    const payroll = await Payroll.create({
      user,
      month,
      year,
      basicSalary,
      allowances: allowances || 0,
      deductions: deductions || 0,
      netSalary,
    });
    res.status(201).json({ success: true, data: payroll });
  } catch (error: any) {
    if (error.code === 11000) {
      res.status(400).json({ success: false, error: 'Payroll already generated for this employee for the specified month and year' });
    } else {
      res.status(500).json({ success: false, error: error.message });
    }
  }
};
export const getAllPayrolls = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const payrolls = await Payroll.find()
      .populate({
        path: 'user',
        select: 'email role',
        populate: {
          path: 'employeeProfile',
          select: 'firstName lastName employeeId department designation'
        }
      })
      .sort({ year: -1, month: -1 });
    res.status(200).json({ success: true, count: payrolls.length, data: payrolls });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};
export const getMyPayrolls = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const payrolls = await Payroll.find({ user: req.user?._id }).sort({ year: -1, month: -1 });
    res.status(200).json({ success: true, count: payrolls.length, data: payrolls });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};
export const updatePayrollStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status } = req.body;
    if (!status || !['Pending', 'Paid'].includes(status)) {
      res.status(400).json({ success: false, error: 'Invalid status' });
      return;
    }
    const payroll = await Payroll.findById(req.params.id);
    if (!payroll) {
      res.status(404).json({ success: false, error: 'Payroll record not found' });
      return;
    }
    payroll.status = status;
    await payroll.save();
    res.status(200).json({ success: true, data: payroll });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};
