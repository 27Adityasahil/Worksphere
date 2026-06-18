import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography, Divider } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import LeaveIcon from '@mui/icons-material/EventNote';
import PayrollIcon from '@mui/icons-material/AttachMoney';
import SettingsIcon from '@mui/icons-material/Settings';
import { useNavigate, useLocation } from 'react-router-dom';
const drawerWidth = 240;
const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin/dashboard' },
    { text: 'Employees', icon: <PeopleIcon />, path: '/admin/employees' },
    { text: 'Attendance Logs', icon: <LeaveIcon />, path: '/admin/attendance' },
    { text: 'Leave Requests', icon: <LeaveIcon />, path: '/admin/leaves' },
    { text: 'Payroll', icon: <PayrollIcon />, path: '/admin/payroll' },
    { text: 'Settings', icon: <SettingsIcon />, path: '/admin/settings' },
  ];
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box', backgroundColor: 'var(--surface)' },
      }}
    >
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
          WorkSphere
        </Typography>
      </Box>
      <Divider />
      <Box sx={{ overflow: 'auto' }}>
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton 
                onClick={() => navigate(item.path)}
                sx={{
                  backgroundColor: location.pathname.includes(item.path) ? 'rgba(37, 99, 235, 0.08)' : 'transparent',
                  borderRight: location.pathname.includes(item.path) ? '4px solid var(--primary)' : '4px solid transparent',
                }}
              >
                <ListItemIcon sx={{ color: location.pathname.includes(item.path) ? 'primary.main' : 'inherit' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  slotProps={{ primary: { sx: { fontWeight: location.pathname.includes(item.path) ? 'bold' : 'normal', color: location.pathname.includes(item.path) ? 'primary.main' : 'inherit'
                     } } }} 
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};
export default Sidebar;
