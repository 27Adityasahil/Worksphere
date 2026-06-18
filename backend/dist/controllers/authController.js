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
exports.resetPassword = exports.logoutUser = exports.loginUser = void 0;
const User_1 = __importDefault(require("../models/User"));
const generateToken_1 = __importDefault(require("../utils/generateToken"));
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield User_1.default.findOne({ email }).select('+password').populate('employeeProfile');
        if (user && (yield user.comparePassword(password))) {
            (0, generateToken_1.default)(res, user._id.toString());
            res.status(200).json({
                success: true,
                data: {
                    _id: user._id,
                    email: user.email,
                    role: user.role,
                    isFirstLogin: user.isFirstLogin,
                    employeeProfile: user.employeeProfile
                }
            });
        }
        else {
            res.status(401).json({ success: false, error: 'Invalid email or password' });
        }
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
exports.loginUser = loginUser;
const logoutUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0),
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'none'
    });
    res.status(200).json({ success: true, message: 'Logged out successfully' });
});
exports.logoutUser = logoutUser;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, tempPassword, newPassword } = req.body;
        const user = yield User_1.default.findOne({ email }).select('+password');
        if (user && (yield user.comparePassword(tempPassword))) {
            user.password = newPassword;
            user.isFirstLogin = false;
            yield user.save();
            (0, generateToken_1.default)(res, user._id.toString());
            res.status(200).json({
                success: true,
                message: 'Password reset successful',
                data: {
                    _id: user._id,
                    email: user.email,
                    role: user.role,
                    isFirstLogin: user.isFirstLogin
                }
            });
        }
        else {
            res.status(401).json({ success: false, error: 'Invalid email or temporary password' });
        }
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
exports.resetPassword = resetPassword;
