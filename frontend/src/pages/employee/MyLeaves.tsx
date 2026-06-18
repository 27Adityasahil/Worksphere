import { useState } from 'react';
import { Box, Typography, Paper, Grid, Button, CircularProgress, Alert, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useGetMyLeavesQuery, useSubmitLeaveMutation } from '../../store/api/leaveApiSlice';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
const leaveSchema = z.object({
  leaveType: z.enum(['Sick', 'Casual', 'Paid', 'Unpaid']),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  reason: z.string().min(5, 'Please provide a valid reason (min 5 characters)'),
});
type LeaveFormData = z.infer<typeof leaveSchema>;
const MyLeaves = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const { data: response, isLoading: isLoadingLeaves } = useGetMyLeavesQuery({});
  const [submitLeave, { isLoading: isSubmitting }] = useSubmitLeaveMutation();
  const leaves = response?.data || [];
  const { register, handleSubmit, formState: { errors }, reset } = useForm<LeaveFormData>({
    resolver: zodResolver(leaveSchema),
    defaultValues: {
      leaveType: 'Casual'
    }
  });
  const handleFormSubmit = async (data: LeaveFormData) => {
    setSubmitError(null);
    setSubmitSuccess(null);
    try {
      await submitLeave(data).unwrap();
      setSubmitSuccess('Leave request submitted successfully.');
      setIsFormOpen(false);
      reset();
    } catch (err: any) {
      setSubmitError(err.data?.error || err.error || 'Failed to submit leave request');
    }
  };
  const handleClose = () => {
    reset();
    setSubmitError(null);
    setIsFormOpen(false);
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          My Leaves
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          color="primary"
          onClick={() => setIsFormOpen(true)}
        >
          Request Leave
        </Button>
      </Box>
      {submitSuccess && <Alert severity="success" sx={{ mb: 4 }}>{submitSuccess}</Alert>}
      <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: 2 }}>
        {isLoadingLeaves ? (
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
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f8fafc' }}>Type</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f8fafc' }}>Duration</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f8fafc' }}>Reason</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f8fafc' }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f8fafc' }}>Admin Note</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {leaves.map((leave: any) => (
                  <TableRow hover key={leave._id}>
                    <TableCell sx={{ fontWeight: 500 }}>{leave.leaveType}</TableCell>
                    <TableCell>
                      {new Date(leave.startDate).toLocaleDateString()} to {new Date(leave.endDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell sx={{ maxWidth: 300, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {leave.reason}
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={leave.status} 
                        color={getStatusColor(leave.status)} 
                        size="small" 
                      />
                    </TableCell>
                    <TableCell>{leave.adminComment || '--'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
      <Dialog open={isFormOpen} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Request Leave</DialogTitle>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <DialogContent dividers>
            {submitError && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {submitError}
              </Alert>
            )}
            <Grid container spacing={3}>
              <Grid size={{ xs: 12 }}>
                <TextField
                  select
                  fullWidth
                  label="Leave Type"
                  defaultValue="Casual"
                  {...register('leaveType')}
                  error={!!errors.leaveType}
                  helperText={errors.leaveType?.message}
                >
                  <MenuItem value="Sick">Sick Leave</MenuItem>
                  <MenuItem value="Casual">Casual Leave</MenuItem>
                  <MenuItem value="Paid">Paid Time Off</MenuItem>
                  <MenuItem value="Unpaid">Unpaid Leave</MenuItem>
                </TextField>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Start Date"
                  type="date"
                  slotProps={{ inputLabel: { shrink: true } }}
                  {...register('startDate')}
                  error={!!errors.startDate}
                  helperText={errors.startDate?.message}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="End Date"
                  type="date"
                  slotProps={{ inputLabel: { shrink: true } }}
                  {...register('endDate')}
                  error={!!errors.endDate}
                  helperText={errors.endDate?.message}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Reason"
                  placeholder="Please provide a reason for your leave request..."
                  {...register('reason')}
                  error={!!errors.reason}
                  helperText={errors.reason?.message}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button 
              type="submit" 
              variant="contained" 
              color="primary"
              disabled={isSubmitting}
              startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
            >
              Submit Request
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};
export default MyLeaves;
