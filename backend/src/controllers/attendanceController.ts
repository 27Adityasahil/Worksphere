import { Request, Response } from 'express';
import Attendance from '../models/Attendance';
import Settings from '../models/Settings';
import AttendanceViolation from '../models/AttendanceViolation';
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371e3; 
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};
const checkGeofence = async (userId: any, lat: number, lng: number): Promise<{ isValid: boolean; error?: string; distance?: number }> => {
  const settings = await Settings.findOne();
  if (!settings || !settings.geofenceCenter || (settings.geofenceCenter.lat === 0 && settings.geofenceCenter.lng === 0)) {
    return { isValid: true };
  }
  const distance = calculateDistance(
    lat, lng,
    settings.geofenceCenter.lat, settings.geofenceCenter.lng
  );
  if (distance > settings.geofenceRadius) {
    await AttendanceViolation.create({
      user: userId,
      date: new Date(new Date().setHours(0, 0, 0, 0)),
      attemptTime: new Date(),
      location: { lat, lng },
      distanceFromCenter: distance
    });
    return { isValid: false, error: `You are ${Math.round(distance)}m away from the office. Must be within ${settings.geofenceRadius}m to clock in/out.`, distance };
  }
  return { isValid: true, distance };
};
export const clockIn = async (req: Request, res: Response): Promise<void> => {
  try {
    const { lat, lng } = req.body;
    if (!lat || !lng) {
      res.status(400).json({ success: false, error: 'Location coordinates are required' });
      return;
    }
    const geofenceCheck = await checkGeofence(req.user?._id, lat, lng);
    if (!geofenceCheck.isValid) {
      res.status(403).json({ success: false, error: geofenceCheck.error });
      return;
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const existingAttendance = await Attendance.findOne({
      user: req.user?._id,
      date: today,
    });
    if (existingAttendance) {
      res.status(400).json({ success: false, error: 'Already clocked in today' });
      return;
    }
    const currentTime = new Date();
    const cutoffTime = new Date();
    cutoffTime.setHours(9, 30, 0, 0);
    const status = currentTime > cutoffTime ? 'Late' : 'Present';
    const attendance = await Attendance.create({
      user: req.user?._id,
      date: today,
      clockIn: {
        time: currentTime,
        location: { lat, lng }
      },
      status
    });
    res.status(201).json({ success: true, data: attendance });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};
export const clockOut = async (req: Request, res: Response): Promise<void> => {
  try {
    const { lat, lng } = req.body;
    if (!lat || !lng) {
      res.status(400).json({ success: false, error: 'Location coordinates are required' });
      return;
    }
    const geofenceCheck = await checkGeofence(req.user?._id, lat, lng);
    if (!geofenceCheck.isValid) {
      res.status(403).json({ success: false, error: geofenceCheck.error });
      return;
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const attendance = await Attendance.findOne({
      user: req.user?._id,
      date: today,
    });
    if (!attendance) {
      res.status(404).json({ success: false, error: 'No clock-in record found for today' });
      return;
    }
    if (attendance.clockOut && attendance.clockOut.time) {
      res.status(400).json({ success: false, error: 'Already clocked out today' });
      return;
    }
    attendance.clockOut = {
      time: new Date(),
      location: { lat, lng }
    };
    await attendance.save();
    res.status(200).json({ success: true, data: attendance });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};
export const getMyAttendance = async (req: Request, res: Response): Promise<void> => {
  try {
    const attendance = await Attendance.find({ user: req.user?._id }).sort('-date');
    res.status(200).json({ success: true, count: attendance.length, data: attendance });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};
export const getAllAttendance = async (req: Request, res: Response): Promise<void> => {
  try {
    const attendance = await Attendance.find()
      .populate({
        path: 'user',
        select: 'email role',
        populate: {
          path: 'employeeProfile',
          select: 'firstName lastName employeeId department'
        }
      })
      .sort('-date');
    res.status(200).json({ success: true, count: attendance.length, data: attendance });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};
export const getViolations = async (req: Request, res: Response): Promise<void> => {
  try {
    const violations = await AttendanceViolation.find()
      .populate({
        path: 'user',
        select: 'email role',
        populate: {
          path: 'employeeProfile',
          select: 'firstName lastName employeeId department'
        }
      })
      .sort('-attemptTime');
    res.status(200).json({ success: true, count: violations.length, data: violations });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};
