"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.updateEmployee = exports.getEmployeeById = exports.getEmployees = exports.createEmployee = void 0;
const User_1 = __importStar(require("../models/User"));
const EmployeeProfile_1 = __importDefault(require("../models/EmployeeProfile"));
const sendEmail_1 = __importDefault(require("../utils/sendEmail"));
const crypto_1 = __importDefault(require("crypto"));
const generateTempPassword = () => {
    return crypto_1.default.randomBytes(6).toString('hex');
};
const generateEmployeeId = () => __awaiter(void 0, void 0, void 0, function* () {
    const count = yield EmployeeProfile_1.default.countDocuments();
    const nextId = count + 1;
    return `EMP-${nextId.toString().padStart(4, '0')}`;
});
const createEmployee = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, firstName, lastName, department, designation, joiningDate, contactNumber, role } = req.body;
        const userExists = yield User_1.default.findOne({ email });
        if (userExists) {
            res.status(400).json({ success: false, error: 'User already exists with this email' });
            return;
        }
        const tempPassword = generateTempPassword();
        const employeeId = yield generateEmployeeId();
        const user = yield User_1.default.create({
            email,
            password: tempPassword,
            role: role || User_1.UserRole.EMPLOYEE,
            isFirstLogin: true,
            isActive: true
        });
        const profile = yield EmployeeProfile_1.default.create({
            user: user._id,
            employeeId,
            firstName,
            lastName,
            department,
            designation,
            joiningDate,
            contactNumber
        });
        user.employeeProfile = profile._id;
        yield user.save();
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
            yield (0, sendEmail_1.default)({
                email: user.email,
                subject: 'Welcome to WorkSphere - Account Details',
                message,
            });
        }
        catch (err) {
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
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
exports.createEmployee = createEmployee;
const getEmployees = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const employees = yield EmployeeProfile_1.default.find().populate('user', 'email role isActive');
        res.status(200).json({ success: true, data: employees });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
exports.getEmployees = getEmployees;
const getEmployeeById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const employee = yield EmployeeProfile_1.default.findById(req.params.id).populate('user', 'email role isActive');
        if (!employee) {
            res.status(404).json({ success: false, error: 'Employee not found' });
            return;
        }
        res.status(200).json({ success: true, data: employee });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
exports.getEmployeeById = getEmployeeById;
const updateEmployee = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let employee = yield EmployeeProfile_1.default.findById(req.params.id);
        if (!employee) {
            res.status(404).json({ success: false, error: 'Employee not found' });
            return;
        }
        employee = yield EmployeeProfile_1.default.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        }).populate('user', 'email role isActive');
        res.status(200).json({ success: true, data: employee });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
exports.updateEmployee = updateEmployee;
