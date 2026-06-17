# WorkSphere - HRMS Frontend

This is the React frontend application for WorkSphere, a comprehensive Human Resource Management System (HRMS) built specifically for managing employee profiles, geofenced attendance, leave requests, and payroll.

## Features

- **Role-Based Portals**: Distinct dashboards for both Employees and Administrators.
- **Geofenced Attendance**: Employees clock in using their device's geolocation, which is automatically validated against the central office coordinates and allowed radius.
- **Leave Management**: Employees can apply for leaves and view their historical leave requests, while Admins can approve or reject them.
- **Payroll System**: Admins can generate monthly payslips detailing basic salary, allowances, and deductions. Employees can view their net pay and download their payslips.
- **Real-Time Analytics**: Admin dashboards dynamically visualize total employees, daily present counts, pending leave requests, and recent attendance geofence violations.
- **Responsive Aesthetics**: A beautiful, modern, and highly responsive UI built entirely with **Material-UI (MUI)**.

## Technology Stack

- **Framework**: [React 18](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Routing**: [React Router DOM v6](https://reactrouter.com/)
- **State Management**: [Redux Toolkit (RTK)](https://redux-toolkit.js.org/) & [RTK Query](https://redux-toolkit.js.org/rtk-query/overview) for efficient API data fetching and caching.
- **UI Components**: [Material-UI (MUI)](https://mui.com/)
- **Notifications**: Custom snackbars and dynamic alerts using MUI.

## Project Structure

```
frontend/
├── src/
│   ├── assets/          # Static assets like images and SVGs
│   ├── components/      # Reusable UI components (Layouts, Forms, Sidebars)
│   ├── pages/           # Main route components (Admin, Employee, Auth pages)
│   ├── store/           # Redux store configuration and RTK Query API slices
│   ├── App.tsx          # Main application routing logic
│   └── main.tsx         # React DOM rendering entry point
├── public/              # Public assets
├── index.html           # HTML template
├── vite.config.ts       # Vite bundler configuration
└── package.json         # Project dependencies and scripts
```

## Setup and Installation

1. **Install Dependencies**
   Make sure you have Node.js installed, then run:
   ```bash
   npm install
   ```

2. **Environment Variables**
   Currently, the application defaults to connecting to the local backend on `http://localhost:5000`. You can configure this globally within the RTK Query `apiSlice.ts` if needed.

3. **Start the Development Server**
   ```bash
   npm run dev
   ```
   The application will be accessible at `http://localhost:5173`.

4. **Build for Production**
   To create an optimized production build:
   ```bash
   npm run build
   ```

## Default Authentication

By default, the backend seeding script provides the following Admin credentials for immediate testing:
- **Email**: `admin@worksphere.com`
- **Password**: `adminpassword123`

When a new employee is created by the Admin, an email containing their system-generated Employee ID and a temporary password is automatically sent to their email inbox via the mock SMTP server (Mailtrap).
