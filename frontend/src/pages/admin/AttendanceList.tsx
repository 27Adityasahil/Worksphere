import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, CircularProgress, Alert } from '@mui/material';
import { useGetAllAttendanceQuery, useGetViolationsQuery } from '../../store/api/attendanceApiSlice';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
const AttendanceList = () => {
  const { data: response, isLoading, isError } = useGetAllAttendanceQuery({});
  const { data: violationsResponse } = useGetViolationsQuery({});
  const attendanceList = response?.data || [];
  const violationsList = violationsResponse?.data || [];
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Company Attendance
        </Typography>
      </Box>
      {violationsList.length > 0 && (
        <Box sx={{ mb: 6 }}>
          <Typography variant="h5" color="error.main" sx={{ fontWeight: 'bold', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <WarningAmberIcon /> Out of Bounds Violations
          </Typography>
          <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: 2, border: '1px solid', borderColor: 'error.main' }}>
            <TableContainer sx={{ maxHeight: 300 }}>
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#fef2f2', color: '#dc2626' }}>Employee</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#fef2f2', color: '#dc2626' }}>Date</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#fef2f2', color: '#dc2626' }}>Attempt Time</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#fef2f2', color: '#dc2626' }}>Location</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#fef2f2', color: '#dc2626' }}>Distance</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {violationsList.map((record: any) => (
                    <TableRow hover key={record._id}>
                      <TableCell sx={{ fontWeight: 500 }}>
                        {record.user?.employeeProfile?.firstName} {record.user?.employeeProfile?.lastName}
                      </TableCell>
                      <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                      <TableCell>{new Date(record.attemptTime).toLocaleTimeString()}</TableCell>
                      <TableCell>
                        <Typography variant="caption" sx={{ display: 'block' }}>
                          {record.location?.lat?.toFixed(4)}, {record.location?.lng?.toFixed(4)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip label={`${Math.round(record.distanceFromCenter)}m away`} color="error" size="small" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Box>
      )}
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : isError ? (
        <Alert severity="error" sx={{ mb: 4 }}>
          Failed to load attendance records.
        </Alert>
      ) : (
        <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: 2 }}>
          <TableContainer sx={{ maxHeight: 600 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f8fafc' }}>Employee ID</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f8fafc' }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f8fafc' }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f8fafc' }}>Clock In</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f8fafc' }}>Clock Out</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f8fafc' }}>Location (Lat, Lng)</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f8fafc' }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {attendanceList.map((record: any) => (
                  <TableRow hover key={record._id}>
                    <TableCell>{record.user?.employeeProfile?.employeeId}</TableCell>
                    <TableCell sx={{ fontWeight: 500 }}>
                      {record.user?.employeeProfile?.firstName} {record.user?.employeeProfile?.lastName}
                    </TableCell>
                    <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      {record.clockIn?.time ? new Date(record.clockIn.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--'}
                    </TableCell>
                    <TableCell>
                      {record.clockOut?.time ? new Date(record.clockOut.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--'}
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                        In: {record.clockIn?.location?.lat?.toFixed(4)}, {record.clockIn?.location?.lng?.toFixed(4)}
                      </Typography>
                      {record.clockOut?.location && (
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                          Out: {record.clockOut?.location?.lat?.toFixed(4)}, {record.clockOut?.location?.lng?.toFixed(4)}
                        </Typography>
                      )}
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
        </Paper>
      )}
    </Box>
  );
};
export default AttendanceList;
