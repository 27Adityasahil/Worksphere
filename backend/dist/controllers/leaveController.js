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
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateLeaveStatus = exports.getAllLeaves = exports.getMyLeaves = exports.submitLeaveRequest = void 0;
const LeaveRequest_1 = __importStar(require("../models/LeaveRequest"));
const submitLeaveRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { leaveType, startDate, endDate, reason } = req.body;
        if (!leaveType || !startDate || !endDate || !reason) {
            res.status(400).json({ success: false, error: 'Please provide all required fields' });
            return;
        }
        if (new Date(startDate) > new Date(endDate)) {
            res.status(400).json({ success: false, error: 'End date must be after start date' });
            return;
        }
        const leaveRequest = yield LeaveRequest_1.default.create({
            user: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id,
            leaveType,
            startDate,
            endDate,
            reason,
            status: LeaveRequest_1.LeaveStatus.PENDING
        });
        res.status(201).json({ success: true, data: leaveRequest });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
exports.submitLeaveRequest = submitLeaveRequest;
const getMyLeaves = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const leaves = yield LeaveRequest_1.default.find({ user: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id }).sort('-createdAt');
        res.status(200).json({ success: true, count: leaves.length, data: leaves });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
exports.getMyLeaves = getMyLeaves;
const getAllLeaves = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const leaves = yield LeaveRequest_1.default.find()
            .populate({
            path: 'user',
            select: 'email',
            populate: {
                path: 'employeeProfile',
                select: 'firstName lastName employeeId department'
            }
        })
            .sort('-createdAt');
        res.status(200).json({ success: true, count: leaves.length, data: leaves });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
exports.getAllLeaves = getAllLeaves;
const updateLeaveStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { status, adminComment } = req.body;
        if (!Object.values(LeaveRequest_1.LeaveStatus).includes(status)) {
            res.status(400).json({ success: false, error: 'Invalid status' });
            return;
        }
        const leaveRequest = yield LeaveRequest_1.default.findById(req.params.id);
        if (!leaveRequest) {
            res.status(404).json({ success: false, error: 'Leave request not found' });
            return;
        }
        leaveRequest.status = status;
        if (adminComment) {
            leaveRequest.adminComment = adminComment;
        }
        yield leaveRequest.save();
        res.status(200).json({ success: true, data: leaveRequest });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
exports.updateLeaveStatus = updateLeaveStatus;
