import { useState, useEffect } from 'react';
import { Box, Typography, Paper, Grid, Button, CircularProgress, Alert, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import { useClockInMutation, useClockOutMutation, useGetMyAttendanceQuery } from '../../store/api/attendanceApiSlice';
import { useGetEmployeeStatsQuery } from '../../store/api/dashboardApiSlice';

const StatCard = ({ title, value, icon, color }: { title: string, value: string | number, icon: any, color: string }) => (
  <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: 2 }}>
    <Box>
      <Typography color="text.secondary" variant="caption" display="block" gutterBottom>
        {title}
      </Typography>
      <Typography variant="h5" fontWeight="bold">
        {value}
      </Typography>
    </Box>
    <Box sx={{ backgroundColor: `${color}15`, p: 1, borderRadius: 2, display: 'flex', color: color }}>
      {icon}
    </Box>
  </Paper>
);

const EmployeeDashboard = () => {
  const { data: attendanceData, isLoading: isLoadingHistory, refetch } = useGetMyAttendanceQuery({});
  const { data: statsResponse, refetch: refetchStats } = useGetEmployeeStatsQuery({});
  const [clockIn, { isLoading: isClockingIn }] = useClockInMutation();
  const [clockOut, { isLoading: isClockingOut }] = useClockOutMutation();
  const [locationError, setLocationError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const getCoordinates = (): Promise<{ lat: number; lng: number }> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser'));
      } else {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          },
          (error) => {
            reject(new Error('Unable to retrieve your location. Please ensure location services are enabled.'));
          }
        );
      }
    });
  };

  const handleClockIn = async () => {
    setLocationError(null);
    setSuccessMsg(null);
    try {
      const coords = await getCoordinates();
      await clockIn(coords).unwrap();
      setSuccessMsg('Successfully clocked in!');
      refetch();
      refetchStats();
    } catch (err: any) {
      setLocationError(err.message || err?.data?.error || 'Failed to clock in');
    }
  };

  const handleClockOut = async () => {
    setLocationError(null);
    setSuccessMsg(null);
    try {
      const coords = await getCoordinates();
      await clockOut(coords).unwrap();
      setSuccessMsg('Successfully clocked out!');
      refetch();
      refetchStats();
    } catch (err: any) {
      setLocationError(err.message || err?.data?.error || 'Failed to clock out');
    }
  };

  const history = attendanceData?.data || [];
  const stats = statsResponse?.data || {};
  const today = new Date().setHours(0, 0, 0, 0);
  const todaysRecord = history.find((record: any) => new Date(record.date).setHours(0, 0, 0, 0) === today);
  const isClockedIn = !!todaysRecord;
  const isClockedOut = isClockedIn && !!todaysRecord.clockOut?.time;

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 4 }}>
        My Workspace
      </Typography>
      {locationError && (
        <Alert severity="error" sx={{ mb: 4 }}>{locationError}</Alert>
      )}
      {successMsg && (
        <Alert severity="success" sx={{ mb: 4 }}>{successMsg}</Alert>
      )}

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <StatCard 
            title="Today's Status" 
            value={stats.todayAttendanceStatus || 'Not Clocked In'} 
            icon={<CheckCircleIcon />} 
            color="#10b981" 
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatCard 
            title="Approved Leaves" 
            value={stats.approvedLeaves || 0} 
            icon={<CheckCircleIcon />} 
            color="#2563eb" 
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatCard 
            title="Pending Leaves" 
            value={stats.pendingLeaves || 0} 
            icon={<EventBusyIcon />} 
            color="#f59e0b" 
          />
        </Grid>
      </Grid>

      <Grid container spacing={4}>
        <Grid item xs={12} md={5} lg={4}>
          <Paper sx={{ p: 4, borderRadius: 4, textAlign: 'center', height: '100%' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
              Time & Attendance
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
              Record your daily attendance using your current location.
            </Typography>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#0f172a' }}>
                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {!isClockedIn ? (
                <Button 
                  variant="contained" 
                  size="large"
                  disabled={isClockingIn}
                  onClick={handleClockIn}
                  sx={{ py: 2, borderRadius: 2, backgroundColor: '#10b981', '&:hover': { backgroundColor: '#059669' } }}
                  startIcon={isClockingIn ? <CircularProgress size={20} color="inherit" /> : <AccessTimeIcon />}
                >
                  {isClockingIn ? 'Getting Location...' : 'Clock In'}
                </Button>
              ) : !isClockedOut ? (
                <Button 
                  variant="contained" 
                  size="large"
                  color="warning"
                  disabled={isClockingOut}
                  onClick={handleClockOut}
                  sx={{ py: 2, borderRadius: 2 }}
                  startIcon={isClockingOut ? <CircularProgress size={20} color="inherit" /> : <AccessTimeIcon />}
                >
                  {isClockingOut ? 'Getting Location...' : 'Clock Out'}
                </Button>
              ) : (
                <Alert severity="info">You have completed your shift for today.</Alert>
              )}
            </Box>
            <Box sx={{ mt: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, color: 'text.secondary' }}>
              <LocationOnIcon fontSize="small" />
              <Typography variant="caption">Requires location access</Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={7} lg={8}>
          <Paper sx={{ p: 0, borderRadius: 4, height: '100%', overflow: 'hidden' }}>
            <Box sx={{ p: 3, borderBottom: '1px solid #e2e8f0' }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Recent Attendance History
              </Typography>
            </Box>
            {isLoadingHistory ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
              </Box>
            ) : history.length === 0 ? (
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography color="text.secondary">No attendance records found.</Typography>
              </Box>
            ) : (
              <TableContainer sx={{ maxHeight: 400 }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f8fafc' }}>Date</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f8fafc' }}>Clock In</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f8fafc' }}>Clock Out</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f8fafc' }}>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {history.map((record: any) => (
                      <TableRow hover key={record._id}>
                        <TableCell>
                          {new Date(record.date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {record.clockIn?.time ? new Date(record.clockIn.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--'}
                        </TableCell>
                        <TableCell>
                          {record.clockOut?.time ? new Date(record.clockOut.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--'}
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={record.status} 
                            color={record.status === 'Present' ? 'success' : record.status === 'Late' ? 'warning' : 'error'} 
                            size="small" 
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};
export default EmployeeDashboard;
