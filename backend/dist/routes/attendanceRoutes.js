"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = require("../models/User");
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const attendanceController_1 = require("../controllers/attendanceController");
const router = express_1.default.Router();
router.post('/clock-in', authMiddleware_1.protect, attendanceController_1.clockIn);
router.put('/clock-out', authMiddleware_1.protect, attendanceController_1.clockOut);
router.get('/me', authMiddleware_1.protect, attendanceController_1.getMyAttendance);
router.get('/violations', authMiddleware_1.protect, (0, authMiddleware_1.authorize)(User_1.UserRole.ADMIN), attendanceController_1.getViolations);
router.get('/', authMiddleware_1.protect, (0, authMiddleware_1.authorize)(User_1.UserRole.ADMIN), attendanceController_1.getAllAttendance);
exports.default = router;
