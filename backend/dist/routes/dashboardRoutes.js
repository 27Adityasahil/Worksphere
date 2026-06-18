"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = require("../models/User");
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const dashboardController_1 = require("../controllers/dashboardController");
const router = express_1.default.Router();
router.get('/admin', authMiddleware_1.protect, (0, authMiddleware_1.authorize)(User_1.UserRole.ADMIN), dashboardController_1.getAdminStats);
router.get('/employee', authMiddleware_1.protect, dashboardController_1.getEmployeeStats);
exports.default = router;
