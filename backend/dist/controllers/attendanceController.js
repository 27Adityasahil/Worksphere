"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getViolations = exports.getAllAttendance = exports.getMyAttendance = exports.clockOut = exports.clockIn = void 0;
const Attendance_1 = __importDefault(require("../models/Attendance"));
const Settings_1 = __importDefault(require("../models/Settings"));
const AttendanceViolation_1 = __importDefault(require("../models/AttendanceViolation"));
const calculateDistance = (lat1, lon1, lat2, lon2) => {
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
const checkGeofence = (userId, lat, lng) => __awaiter(void 0, void 0, void 0, function* () {
    const settings = yield Settings_1.default.findOne();
    if (!settings || !settings.geofenceCenter || (settings.geofenceCenter.lat === 0 && settings.geofenceCenter.lng === 0)) {
        return { isValid: true };
    }
    const distance = calculateDistance(lat, lng, settings.geofenceCenter.lat, settings.geofenceCenter.lng);
    if (distance > settings.geofenceRadius) {
        yield AttendanceViolation_1.default.create({
            user: userId,
            date: new Date(new Date().setHours(0, 0, 0, 0)),
            attemptTime: new Date(),
            location: { lat, lng },
            distanceFromCenter: distance
        });
        return { isValid: false, error: `You are ${Math.round(distance)}m away from the office. Must be within ${settings.geofenceRadius}m to clock in/out.`, distance };
    }
    return { isValid: true, distance };
});
const clockIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const { lat, lng } = req.body;
        if (!lat || !lng) {
            res.status(400).json({ success: false, error: 'Location coordinates are required' });
            return;
        }
        const geofenceCheck = yield checkGeofence((_a = req.user) === null || _a === void 0 ? void 0 : _a._id, lat, lng);
        if (!geofenceCheck.isValid) {
            res.status(403).json({ success: false, error: geofenceCheck.error });
            return;
        }
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const existingAttendance = yield Attendance_1.default.findOne({
            user: (_b = req.user) === null || _b === void 0 ? void 0 : _b._id,
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
        const attendance = yield Attendance_1.default.create({
            user: (_c = req.user) === null || _c === void 0 ? void 0 : _c._id,
            date: today,
            clockIn: {
                time: currentTime,
                location: { lat, lng }
            },
            status
        });
        res.status(201).json({ success: true, data: attendance });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
exports.clockIn = clockIn;
const clockOut = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { lat, lng } = req.body;
        if (!lat || !lng) {
            res.status(400).json({ success: false, error: 'Location coordinates are required' });
            return;
        }
        const geofenceCheck = yield checkGeofence((_a = req.user) === null || _a === void 0 ? void 0 : _a._id, lat, lng);
        if (!geofenceCheck.isValid) {
            res.status(403).json({ success: false, error: geofenceCheck.error });
            return;
        }
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const attendance = yield Attendance_1.default.findOne({
            user: (_b = req.user) === null || _b === void 0 ? void 0 : _b._id,
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
        yield attendance.save();
        res.status(200).json({ success: true, data: attendance });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
exports.clockOut = clockOut;
const getMyAttendance = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const attendance = yield Attendance_1.default.find({ user: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id }).sort('-date');
        res.status(200).json({ success: true, count: attendance.length, data: attendance });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
exports.getMyAttendance = getMyAttendance;
const getAllAttendance = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const attendance = yield Attendance_1.default.find()
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
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
exports.getAllAttendance = getAllAttendance;
const getViolations = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const violations = yield AttendanceViolation_1.default.find()
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
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
exports.getViolations = getViolations;
