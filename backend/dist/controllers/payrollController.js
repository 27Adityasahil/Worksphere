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
exports.updatePayrollStatus = exports.getMyPayrolls = exports.getAllPayrolls = exports.generatePayroll = void 0;
const Payroll_1 = __importDefault(require("../models/Payroll"));
const generatePayroll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user, month, year, basicSalary, allowances, deductions } = req.body;
        if (!user || !month || !year || basicSalary === undefined) {
            res.status(400).json({ success: false, error: 'Please provide user, month, year, and basicSalary' });
            return;
        }
        const netSalary = basicSalary + (allowances || 0) - (deductions || 0);
        const payroll = yield Payroll_1.default.create({
            user,
            month,
            year,
            basicSalary,
            allowances: allowances || 0,
            deductions: deductions || 0,
            netSalary,
        });
        res.status(201).json({ success: true, data: payroll });
    }
    catch (error) {
        if (error.code === 11000) {
            res.status(400).json({ success: false, error: 'Payroll already generated for this employee for the specified month and year' });
        }
        else {
            res.status(500).json({ success: false, error: error.message });
        }
    }
});
exports.generatePayroll = generatePayroll;
const getAllPayrolls = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payrolls = yield Payroll_1.default.find()
            .populate({
            path: 'user',
            select: 'email role',
            populate: {
                path: 'employeeProfile',
                select: 'firstName lastName employeeId department designation'
            }
        })
            .sort({ year: -1, month: -1 });
        res.status(200).json({ success: true, count: payrolls.length, data: payrolls });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
exports.getAllPayrolls = getAllPayrolls;
const getMyPayrolls = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const payrolls = yield Payroll_1.default.find({ user: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id }).sort({ year: -1, month: -1 });
        res.status(200).json({ success: true, count: payrolls.length, data: payrolls });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
exports.getMyPayrolls = getMyPayrolls;
const updatePayrollStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { status } = req.body;
        if (!status || !['Pending', 'Paid'].includes(status)) {
            res.status(400).json({ success: false, error: 'Invalid status' });
            return;
        }
        const payroll = yield Payroll_1.default.findById(req.params.id);
        if (!payroll) {
            res.status(404).json({ success: false, error: 'Payroll record not found' });
            return;
        }
        payroll.status = status;
        yield payroll.save();
        res.status(200).json({ success: true, data: payroll });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
exports.updatePayrollStatus = updatePayrollStatus;
