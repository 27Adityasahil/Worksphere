"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const employeeRoutes_1 = __importDefault(require("./routes/employeeRoutes"));
const attendanceRoutes_1 = __importDefault(require("./routes/attendanceRoutes"));
const leaveRoutes_1 = __importDefault(require("./routes/leaveRoutes"));
const settingsRoutes_1 = __importDefault(require("./routes/settingsRoutes"));
const payrollRoutes_1 = __importDefault(require("./routes/payrollRoutes"));
const dashboardRoutes_1 = __importDefault(require("./routes/dashboardRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: ['http://localhost:5173', 'https://workspheree.vercel.app'],
    credentials: true
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use('/api/auth', authRoutes_1.default);
app.use('/api/employees', employeeRoutes_1.default);
app.use('/api/attendance', attendanceRoutes_1.default);
app.use('/api/leaves', leaveRoutes_1.default);
app.use('/api/settings', settingsRoutes_1.default);
app.use('/api/payroll', payrollRoutes_1.default);
app.use('/api/dashboard', dashboardRoutes_1.default);
app.get('/', (req, res) => {
    res.send('WorkSphere API is running...');
});
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        error: err.message || 'Server Error'
    });
});
exports.default = app;
