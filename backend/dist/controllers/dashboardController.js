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
exports.getEmployeeStats = exports.getAdminStats = void 0;
const EmployeeProfile_1 = __importDefault(require("../models/EmployeeProfile"));
const Attendance_1 = __importDefault(require("../models/Attendance"));
const LeaveRequest_1 = __importDefault(require("../models/LeaveRequest"));
const AttendanceViolation_1 = __importDefault(require("../models/AttendanceViolation"));
const getAdminStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const totalEmployees = yield EmployeeProfile_1.default.countDocuments();
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);
        const todayAttendance = yield Attendance_1.default.countDocuments({
            date: { $gte: startOfDay, $lte: endOfDay },
            status: { $in: ['Present', 'Late'] }
        });
        const pendingLeaves = yield LeaveRequest_1.default.countDocuments({
            status: 'Pending'
        });
        const recentViolations = yield AttendanceViolation_1.default.find()
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
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
exports.getAdminStats = getAdminStats;
const getEmployeeStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);
        const todayAttendance = yield Attendance_1.default.findOne({
            user: userId,
            date: { $gte: startOfDay, $lte: endOfDay }
        });
        const approvedLeaves = yield LeaveRequest_1.default.countDocuments({
            user: userId,
            status: 'Approved'
        });
        const pendingLeaves = yield LeaveRequest_1.default.countDocuments({
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
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
exports.getEmployeeStats = getEmployeeStats;
