"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const employeeController_1 = require("../controllers/employeeController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const User_1 = require("../models/User");
const router = express_1.default.Router();
router.use(authMiddleware_1.protect);
router.route('/')
    .get(employeeController_1.getEmployees)
    .post((0, authMiddleware_1.authorize)(User_1.UserRole.ADMIN, User_1.UserRole.MANAGER), employeeController_1.createEmployee);
router.route('/:id')
    .get(employeeController_1.getEmployeeById)
    .put((0, authMiddleware_1.authorize)(User_1.UserRole.ADMIN, User_1.UserRole.MANAGER), employeeController_1.updateEmployee);
exports.default = router;
