import { Typography, Grid, Paper, Box, CircularProgress, Alert, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LeaveIcon from '@mui/icons-material/EventNote';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { useGetAdminStatsQuery } from '../../store/api/dashboardApiSlice';

const StatCard = ({ title, value, icon, color }: { title: string, value: string | number, icon: any, color: string }) => (
  <Paper sx={{ p: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: 2 }}>
    <Box>
      <Typography color="text.secondary" variant="subtitle2" gutterBottom>
        {title}
      </Typography>
      <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
        {value}
      </Typography>
    </Box>
    <Box sx={{ backgroundColor: `${color}15`, p: 1.5, borderRadius: 2, display: 'flex', color: color }}>
      {icon}
    </Box>
  </Paper>
);

const Dashboard = () => {
  const { data: response, isLoading, isError } = useGetAdminStatsQuery({});
  
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return <Alert severity="error">Failed to load dashboard statistics.</Alert>;
  }

  const stats = response?.data;
  const violations = stats?.recentViolations || [];

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>
        Dashboard Overview
      </Typography>
      <Grid container spacing={3} sx={{ mb: 6 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard 
            title="Total Employees" 
            value={stats?.totalEmployees || 0} 
            icon={<PeopleIcon />} 
            color="#2563eb" 
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard 
            title="Present Today" 
            value={stats?.todayAttendance || 0} 
            icon={<CheckCircleIcon />} 
            color="#10b981" 
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard 
            title="Pending Leaves" 
            value={stats?.pendingLeaves || 0} 
            icon={<LeaveIcon />} 
            color="#f59e0b" 
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard 
            title="Recent Violations" 
            value={violations.length} 
            icon={<WarningAmberIcon />} 
            color="#ef4444" 
          />
        </Grid>
      </Grid>

      <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
        Recent Geofence Violations
      </Typography>
      
      <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: 2 }}>
        {violations.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography color="text.secondary">No recent attendance violations.</Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f8fafc' }}>Employee</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f8fafc' }}>Attempt Time</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f8fafc' }}>Distance</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f8fafc' }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {violations.map((v: any) => (
                  <TableRow hover key={v._id}>
                    <TableCell>
                      {v.user?.employeeProfile?.firstName} {v.user?.employeeProfile?.lastName}
                    </TableCell>
                    <TableCell>{new Date(v.attemptTime).toLocaleString()}</TableCell>
                    <TableCell>{Math.round(v.distanceFromCenter)}m away</TableCell>
                    <TableCell>
                      <Chip label="Blocked" color="error" size="small" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Box>
  );
};

export default Dashboard;
