"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = require("../models/User");
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const leaveController_1 = require("../controllers/leaveController");
const router = express_1.default.Router();
router.post('/', authMiddleware_1.protect, leaveController_1.submitLeaveRequest);
router.get('/me', authMiddleware_1.protect, leaveController_1.getMyLeaves);
router.get('/', authMiddleware_1.protect, (0, authMiddleware_1.authorize)(User_1.UserRole.ADMIN), leaveController_1.getAllLeaves);
router.put('/:id/status', authMiddleware_1.protect, (0, authMiddleware_1.authorize)(User_1.UserRole.ADMIN), leaveController_1.updateLeaveStatus);
exports.default = router;
