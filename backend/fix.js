const fs = require('fs');
const path = require('path');

const dir = 'd:/new portfolio projects/hrms/backend/src';

// 1. Add UserRole import to routes
const routes = ['attendanceRoutes.ts', 'dashboardRoutes.ts', 'leaveRoutes.ts', 'payrollRoutes.ts', 'settingsRoutes.ts'];
for (const file of routes) {
  const p = path.join(dir, 'routes', file);
  let content = fs.readFileSync(p, 'utf8');
  if (!content.includes('import { UserRole }')) {
    content = 'import { UserRole } from \'../models/User\';\n' + content;
    fs.writeFileSync(p, content);
  }
}

// 2. Change Request to AuthRequest in controllers
const controllers = [
  'attendanceController.ts',
  'leaveController.ts',
  'payrollController.ts',
  'dashboardController.ts',
  'employeeController.ts'
];
for (const file of controllers) {
  const p = path.join(dir, 'controllers', file);
  let content = fs.readFileSync(p, 'utf8');
  if (!content.includes('AuthRequest')) {
    content = content.replace(/import \{ Request, Response \} from 'express';/g, 'import { Request, Response } from \'express\';\nimport { AuthRequest } from \'../middleware/authMiddleware\';');
    content = content.replace(/import \{ Request, Response, NextFunction \} from 'express';/g, 'import { Request, Response, NextFunction } from \'express\';\nimport { AuthRequest } from \'../middleware/authMiddleware\';');
  }
  content = content.replace(/req: Request/g, 'req: AuthRequest');
  fs.writeFileSync(p, content);
}

// 3. Fix dashboardController.ts mongoose query typing error
const dashPath = path.join(dir, 'controllers', 'dashboardController.ts');
let dashContent = fs.readFileSync(dashPath, 'utf8');
dashContent = dashContent.replace(/status: 'Pending'/g, "status: 'Pending' as any");
dashContent = dashContent.replace(/status: 'Approved'/g, "status: 'Approved' as any");
fs.writeFileSync(dashPath, dashContent);

console.log('Fixed controllers and routes');
