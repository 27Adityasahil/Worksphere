import { Box, CssBaseline, AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import { Outlet, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../store/store';
import { logout } from '../../store/slices/authSlice';
import EmployeeSidebar from './EmployeeSidebar';
import LogoutIcon from '@mui/icons-material/Logout';
import { useLogoutMutation } from '../../store/api/authApiSlice';
const drawerWidth = 240;
const EmployeeLayout = () => {
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const [logoutApiCall] = useLogoutMutation();
  const handleLogout = async () => {
    try {
      await logoutApiCall({}).unwrap();
      dispatch(logout());
    } catch (err) {
      console.error(err);
    }
  };
  if (!userInfo) {
    return <Navigate to="/login" replace />;
  }
  if (userInfo.role === 'Admin') {
    return <Navigate to="/admin" replace />;
  }
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <CssBaseline />
      {}
      <AppBar 
        position="fixed" 
        sx={{ 
          width: `calc(100% - ${drawerWidth}px)`, 
          ml: `${drawerWidth}px`,
          backgroundColor: '#ffffff',
          color: '#0f172a',
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
            Employee Portal
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {userInfo.email}
            </Typography>
            <IconButton color="error" onClick={handleLogout} title="Logout">
              <LogoutIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {}
      <EmployeeSidebar />
      {}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 4,
          mt: 8, 
          width: `calc(100% - ${drawerWidth}px)`,
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};
export default EmployeeLayout;
