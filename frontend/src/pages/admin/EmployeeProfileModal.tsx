import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Grid, Box, Divider, Avatar } from '@mui/material';
interface EmployeeProfileModalProps {
  open: boolean;
  onClose: () => void;
  employee: any | null;
}
const EmployeeProfileModal = ({ open, onClose, employee }: EmployeeProfileModalProps) => {
  if (!employee) return null;
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ backgroundColor: 'primary.main', color: 'primary.contrastText' }}>
        Employee Profile
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Avatar 
            sx={{ width: 80, height: 80, mr: 3, backgroundColor: 'primary.light', fontSize: 32 }}
          >
            {employee.firstName?.charAt(0)}{employee.lastName?.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              {employee.firstName} {employee.lastName}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {employee.designation || 'Employee'}
            </Typography>
            <Typography variant="caption" color="primary" sx={{ display: 'block', mt: 0.5, fontWeight: 'bold' }}>
              ID: {employee.employeeId || 'N/A'}
            </Typography>
          </Box>
        </Box>
        <Divider sx={{ my: 2 }} />
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="caption" color="text.secondary">Department</Typography>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>{employee.department || 'N/A'}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="caption" color="text.secondary">Date of Joining</Typography>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {employee.dateOfJoining ? new Date(employee.dateOfJoining).toLocaleDateString() : 'N/A'}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="caption" color="text.secondary">Email Address</Typography>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {employee.user?.email || 'N/A'}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="caption" color="text.secondary">Phone Number</Typography>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {employee.contactNumber || 'N/A'}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="caption" color="text.secondary">Address</Typography>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {employee.address || 'N/A'}
            </Typography>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ p: 2, backgroundColor: '#f8fafc' }}>
        <Button onClick={onClose} variant="outlined">Close</Button>
      </DialogActions>
    </Dialog>
  );
};
export default EmployeeProfileModal;
