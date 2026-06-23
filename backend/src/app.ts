import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import authRoutes from './routes/authRoutes';
import employeeRoutes from './routes/employeeRoutes';
import attendanceRoutes from './routes/attendanceRoutes';
import leaveRoutes from './routes/leaveRoutes';
import settingsRoutes from './routes/settingsRoutes';
import payrollRoutes from './routes/payrollRoutes';
import dashboardRoutes from './routes/dashboardRoutes';
dotenv.config();
const app: Application = express();
app.use(cors({
  origin: ['http://localhost:5173', 'https://workspheree.vercel.app'], 
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/leaves', leaveRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/payroll', payrollRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.get('/api/health', (req: Request, res: Response) => {
  const dbState = mongoose.connection.readyState;
  let dbStatus = 'disconnected';
  if (dbState === 1) dbStatus = 'connected';
  else if (dbState === 2) dbStatus = 'connecting';

  res.json({
    status: 'online',
    service: 'WorkSphere API',
    database: dbStatus,
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.get('/', (req: Request, res: Response) => {
  res.send('WorkSphere API is running...');
});
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: err.message || 'Server Error'
  });
});
export default app;
