import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import User, { UserRole } from '../models/User';
import EmployeeProfile from '../models/EmployeeProfile';
import sendEmail from '../utils/sendEmail';
import crypto from 'crypto';
const generateTempPassword = () => {
  return crypto.randomBytes(6).toString('hex');
};
const generateEmployeeId = async (): Promise<string> => {
  const count = await EmployeeProfile.countDocuments();
  const nextId = count + 1;
  return `EMP-${nextId.toString().padStart(4, '0')}`;
};
export const createEmployee = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { email, firstName, lastName, department, designation, joiningDate, contactNumber, role } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400).json({ success: false, error: 'User already exists with this email' });
      return;
    }
    const tempPassword = generateTempPassword();
    const employeeId = await generateEmployeeId();
    const user = await User.create({
      email,
      password: tempPassword,
      role: role || UserRole.EMPLOYEE,
      isFirstLogin: true,
      isActive: true
    });
    const profile = await EmployeeProfile.create({
      user: user._id,
      employeeId,
      firstName,
      lastName,
      department,
      designation,
      joiningDate,
      contactNumber
    });
    user.employeeProfile = profile._id as any;
    await user.save();
    const message = `
      Hello ${firstName},
      Welcome to WorkSphere! Your account has been created successfully.
      Your Employee ID: ${employeeId}
      Your Temporary Password: ${tempPassword}
      Please login using this temporary password. You will be required to reset it upon your first login.
      Regards,
      HR Team
    `;
    try {
      await sendEmail({
        email: user.email,
        subject: 'Welcome to WorkSphere - Account Details',
        message,
      });
    } catch (err) {
      console.error('Email could not be sent', err);
    }
    console.log(`\n=========================================`);
    console.log(`[DEV] NEW EMPLOYEE CREATED`);
    console.log(`[DEV] Email: ${email}`);
    console.log(`[DEV] Temporary Password: ${tempPassword}`);
    console.log(`=========================================\n`);
    res.status(201).json({
      success: true,
      data: profile,
      tempPassword 
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};
export const getEmployees = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const employees = await EmployeeProfile.find().populate('user', 'email role isActive');
    res.status(200).json({ success: true, data: employees });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};
export const getEmployeeById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const employee = await EmployeeProfile.findById(req.params.id).populate('user', 'email role isActive');
    if (!employee) {
      res.status(404).json({ success: false, error: 'Employee not found' });
      return;
    }
    res.status(200).json({ success: true, data: employee });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};
export const updateEmployee = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    let employee = await EmployeeProfile.findById(req.params.id);
    if (!employee) {
      res.status(404).json({ success: false, error: 'Employee not found' });
      return;
    }
    employee = await EmployeeProfile.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('user', 'email role isActive');
    res.status(200).json({ success: true, data: employee });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};
