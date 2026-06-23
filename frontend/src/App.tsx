import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ServerStatusProvider } from './store/ServerStatusProvider';
import ServerStatusIndicator from './components/common/ServerStatusIndicator';
import ServerConnectionBlocker from './components/common/ServerConnectionBlocker';
import AuthLayout from './components/layout/AuthLayout';
import LoginForm from './components/auth/LoginForm';
import AdminLayout from './components/layout/AdminLayout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/admin/Dashboard';
import EmployeeList from './pages/admin/EmployeeList';
import AttendanceList from './pages/admin/AttendanceList';
import LeaveRequests from './pages/admin/LeaveRequests';
import Settings from './pages/admin/Settings';
import PayrollList from './pages/admin/PayrollList';
import EmployeeLayout from './components/layout/EmployeeLayout';
import EmployeeDashboard from './pages/employee/EmployeeDashboard';
import MyLeaves from './pages/employee/MyLeaves';
import MyPayslips from './pages/employee/MyPayslips';

function App() {
  return (
    <ServerStatusProvider>
      <ServerStatusIndicator />
      <BrowserRouter>
        <Routes>
          {}
          <Route path="/" element={<Landing />} />
          {}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/login/admin" element={
              <ServerConnectionBlocker>
                <LoginForm type="admin" />
              </ServerConnectionBlocker>
            } />
            <Route path="/login/employee" element={
              <ServerConnectionBlocker>
                <LoginForm type="employee" />
              </ServerConnectionBlocker>
            } />
            <Route path="/reset-password" element={<ResetPassword />} />
          </Route>
          {}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={
              <ServerConnectionBlocker>
                <Dashboard />
              </ServerConnectionBlocker>
            } />
            <Route path="employees" element={<EmployeeList />} />
            <Route path="attendance" element={<AttendanceList />} />
            <Route path="leaves" element={<LeaveRequests />} />
            <Route path="payroll" element={<PayrollList />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          {}
          <Route path="/employee" element={<EmployeeLayout />}>
            <Route index element={<Navigate to="/employee/dashboard" replace />} />
            <Route path="dashboard" element={
              <ServerConnectionBlocker>
                <EmployeeDashboard />
              </ServerConnectionBlocker>
            } />
            <Route path="leaves" element={<MyLeaves />} />
            <Route path="payroll" element={<MyPayslips />} />
          </Route>
          {}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </ServerStatusProvider>
  );
}
export default App;
