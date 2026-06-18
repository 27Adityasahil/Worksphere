"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = require("../models/User");
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const payrollController_1 = require("../controllers/payrollController");
const router = express_1.default.Router();
router.post('/', authMiddleware_1.protect, (0, authMiddleware_1.authorize)(User_1.UserRole.ADMIN), payrollController_1.generatePayroll);
router.get('/', authMiddleware_1.protect, (0, authMiddleware_1.authorize)(User_1.UserRole.ADMIN), payrollController_1.getAllPayrolls);
router.get('/me', authMiddleware_1.protect, payrollController_1.getMyPayrolls);
router.put('/:id/status', authMiddleware_1.protect, (0, authMiddleware_1.authorize)(User_1.UserRole.ADMIN), payrollController_1.updatePayrollStatus);
exports.default = router;
