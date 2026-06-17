import { useState } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, IconButton, CircularProgress, Alert, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { useGetAllLeavesQuery, useUpdateLeaveStatusMutation } from '../../store/api/leaveApiSlice';
const LeaveRequests = () => {
  const { data: response, isLoading, isError } = useGetAllLeavesQuery({});
  const [updateStatus, { isLoading: isUpdating }] = useUpdateLeaveStatusMutation();
  const [selectedLeave, setSelectedLeave] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [adminComment, setAdminComment] = useState('');
  const [pendingAction, setPendingAction] = useState<'Approved' | 'Rejected' | null>(null);
  const leaves = response?.data || [];
  const handleOpenDialog = (leave: any, action: 'Approved' | 'Rejected') => {
    setSelectedLeave(leave);
    setPendingAction(action);
    setAdminComment('');
    setIsDialogOpen(true);
  };
  const handleCloseDialog = () => {
    setSelectedLeave(null);
    setPendingAction(null);
    setIsDialogOpen(false);
  };
  const handleConfirmAction = async () => {
    if (!selectedLeave || !pendingAction) return;
    try {
      await updateStatus({
        id: selectedLeave._id,
        status: pendingAction,
        adminComment: adminComment.trim() || undefined
      }).unwrap();
      handleCloseDialog();
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return 'success';
      case 'Rejected': return 'error';
      default: return 'warning';
    }
  };
  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 4 }}>
        Leave Requests
      </Typography>
      {isError && (
        <Alert severity="error" sx={{ mb: 4 }}>
          Failed to load leave requests.
        </Alert>
      )}
      <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: 2 }}>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : leaves.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography color="text.secondary">No leave requests found.</Typography>
          </Box>
        ) : (
          <TableContainer sx={{ maxHeight: 600 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f8fafc' }}>Employee</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f8fafc' }}>Type</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f8fafc' }}>Duration</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f8fafc' }}>Reason</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f8fafc' }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f8fafc', textAlign: 'center' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {leaves.map((leave: any) => (
                  <TableRow hover key={leave._id}>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {leave.user?.employeeProfile?.firstName} {leave.user?.employeeProfile?.lastName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {leave.user?.email}
                      </Typography>
                    </TableCell>
                    <TableCell>{leave.leaveType}</TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {new Date(leave.startDate).toLocaleDateString()}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        to {new Date(leave.endDate).toLocaleDateString()}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ maxWidth: 200, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {leave.reason}
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={leave.status} 
                        color={getStatusColor(leave.status)} 
                        size="small" 
                      />
                    </TableCell>
                    <TableCell align="center">
                      {leave.status === 'Pending' ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                          <Tooltip title="Approve">
                            <IconButton 
                              color="success" 
                              onClick={() => handleOpenDialog(leave, 'Approved')}
                              size="small"
                            >
                              <CheckCircleIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Reject">
                            <IconButton 
                              color="error" 
                              onClick={() => handleOpenDialog(leave, 'Rejected')}
                              size="small"
                            >
                              <CancelIcon />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      ) : (
                        <Typography variant="caption" color="text.secondary">
                          Processed
                        </Typography>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
      {}
      <Dialog open={isDialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {pendingAction === 'Approved' ? 'Approve' : 'Reject'} Leave Request
        </DialogTitle>
        <DialogContent dividers>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Are you sure you want to {pendingAction?.toLowerCase()} the leave request for 
            <strong> {selectedLeave?.user?.employeeProfile?.firstName} {selectedLeave?.user?.employeeProfile?.lastName}</strong>?
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Admin Comment (Optional)"
            placeholder={`Add a note regarding this ${pendingAction?.toLowerCase()}...`}
            value={adminComment}
            onChange={(e) => setAdminComment(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={isUpdating}>Cancel</Button>
          <Button 
            variant="contained" 
            color={pendingAction === 'Approved' ? 'success' : 'error'}
            onClick={handleConfirmAction}
            disabled={isUpdating}
            startIcon={isUpdating ? <CircularProgress size={20} color="inherit" /> : null}
          >
            Confirm {pendingAction}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
export default LeaveRequests;
