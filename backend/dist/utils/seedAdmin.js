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
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const User_1 = __importStar(require("../models/User"));
const EmployeeProfile_1 = __importDefault(require("../models/EmployeeProfile"));
dotenv_1.default.config();
const seedAdmin = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB...');
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@worksphere.com';
        const adminPassword = process.env.ADMIN_PASSWORD || 'adminpassword123';
        const adminExists = yield User_1.default.findOne({ email: adminEmail });
        if (adminExists) {
            console.log('Admin user already exists!');
            process.exit(0);
        }
        const adminUser = yield User_1.default.create({
            email: adminEmail,
            password: adminPassword,
            role: User_1.UserRole.ADMIN,
            isFirstLogin: false,
            isActive: true,
        });
        const adminProfile = yield EmployeeProfile_1.default.create({
            user: adminUser._id,
            employeeId: 'ADM-0001',
            firstName: 'System',
            lastName: 'Administrator',
            department: 'Management',
            designation: 'Super Admin',
            joiningDate: new Date(),
            contactNumber: '1234567890',
        });
        adminUser.employeeProfile = adminProfile._id;
        yield adminUser.save();
        console.log('Admin user successfully seeded!');
        console.log('---------------------------------');
        console.log(`Email: ${adminEmail}`);
        console.log(`Password: ${adminPassword}`);
        console.log('---------------------------------');
        process.exit(0);
    }
    catch (error) {
        console.error('Error seeding admin:', error);
        process.exit(1);
    }
});
seedAdmin();
