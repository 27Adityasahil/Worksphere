import { useState } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, CircularProgress, Alert, Chip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useGetAllPayrollsQuery, useGeneratePayrollMutation, useUpdatePayrollStatusMutation } from '../../store/api/payrollApiSlice';
import { useGetEmployeesQuery } from '../../store/api/employeeApiSlice';
const PayrollList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState('');
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [basicSalary, setBasicSalary] = useState(0);
  const [allowances, setAllowances] = useState(0);
  const [deductions, setDeductions] = useState(0);
  const [formError, setFormError] = useState<string | null>(null);
  const { data: payrollRes, isLoading } = useGetAllPayrollsQuery({});
  const { data: employeeRes } = useGetEmployeesQuery({});
  const [generatePayroll, { isLoading: isGenerating }] = useGeneratePayrollMutation();
  const [updateStatus] = useUpdatePayrollStatusMutation();
  const payrolls = payrollRes?.data || [];
  const employees = employeeRes?.data || [];
  const handleGenerate = async () => {
    setFormError(null);
    try {
      await generatePayroll({
        user: selectedUser,
        month,
        year,
        basicSalary,
        allowances,
        deductions
      }).unwrap();
      setIsModalOpen(false);
      // Reset form
      setSelectedUser('');
      setBasicSalary(0);
      setAllowances(0);
      setDeductions(0);
    } catch (err: any) {
      setFormError(err.data?.error || err.error || 'Failed to generate payroll');
    }
  };
  const handleMarkAsPaid = async (id: string) => {
    try {
      await updateStatus({ id, status: 'Paid' }).unwrap();
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };
  const months = [
    { value: 1, label: 'January' }, { value: 2, label: 'February' },
    { value: 3, label: 'March' }, { value: 4, label: 'April' },
    { value: 5, label: 'May' }, { value: 6, label: 'June' },
    { value: 7, label: 'July' }, { value: 8, label: 'August' },
    { value: 9, label: 'September' }, { value: 10, label: 'October' },
    { value: 11, label: 'November' }, { value: 12, label: 'December' },
  ];
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Payroll Management
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          color="primary"
          onClick={() => setIsModalOpen(true)}
        >
          Generate Payslip
        </Button>
      </Box>
      <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: 2 }}>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : payrolls.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography color="text.secondary">No payroll records generated yet.</Typography>
          </Box>
        ) : (
          <TableContainer sx={{ maxHeight: 600 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f8fafc' }}>Employee</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f8fafc' }}>Period</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f8fafc' }}>Basic</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f8fafc' }}>Allowances</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f8fafc' }}>Deductions</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f8fafc' }}>Net Pay</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f8fafc' }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f8fafc', textAlign: 'center' }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {payrolls.map((pr: any) => (
                  <TableRow hover key={pr._id}>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {pr.user?.employeeProfile?.firstName} {pr.user?.employeeProfile?.lastName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {pr.user?.email}
                      </Typography>
                    </TableCell>
                    <TableCell>{months.find(m => m.value === pr.month)?.label} {pr.year}</TableCell>
                    <TableCell>${pr.basicSalary}</TableCell>
                    <TableCell>${pr.allowances}</TableCell>
                    <TableCell>${pr.deductions}</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                      ${pr.netSalary}
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={pr.status} 
                        color={pr.status === 'Paid' ? 'success' : 'warning'} 
                        size="small" 
                      />
                    </TableCell>
                    <TableCell align="center">
                      {pr.status === 'Pending' ? (
                        <Button 
                          size="small" 
                          variant="outlined" 
                          color="success"
                          startIcon={<CheckCircleIcon />}
                          onClick={() => handleMarkAsPaid(pr._id)}
                        >
                          Mark Paid
                        </Button>
                      ) : (
                        <Typography variant="caption" color="success.main" sx={{ fontWeight: 'bold' }}>
                          Paid
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
      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Generate Payslip</DialogTitle>
        <DialogContent dividers>
          {formError && <Alert severity="error" sx={{ mb: 3 }}>{formError}</Alert>}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
            <TextField
              select
              label="Employee"
              fullWidth
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
            >
              {employees.map((emp: any) => (
                <MenuItem key={emp.user._id} value={emp.user._id}>
                  {emp.firstName} {emp.lastName} ({emp.employeeId})
                </MenuItem>
              ))}
            </TextField>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                select
                label="Month"
                fullWidth
                value={month}
                onChange={(e) => setMonth(Number(e.target.value))}
              >
                {months.map((m) => (
                  <MenuItem key={m.value} value={m.value}>{m.label}</MenuItem>
                ))}
              </TextField>
              <TextField
                label="Year"
                type="number"
                fullWidth
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
              />
            </Box>
            <TextField
              label="Basic Salary ($)"
              type="number"
              fullWidth
              value={basicSalary || ''}
              onChange={(e) => setBasicSalary(Number(e.target.value))}
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Allowances ($)"
                type="number"
                fullWidth
                value={allowances || ''}
                onChange={(e) => setAllowances(Number(e.target.value))}
              />
              <TextField
                label="Deductions ($)"
                type="number"
                fullWidth
                value={deductions || ''}
                onChange={(e) => setDeductions(Number(e.target.value))}
              />
            </Box>
            <Box sx={{ p: 2, backgroundColor: '#f8fafc', borderRadius: 1, mt: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', display: 'flex', justifyContent: 'space-between' }}>
                <span>Net Pay:</span>
                <span>${basicSalary + allowances - deductions}</span>
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleGenerate}
            disabled={isGenerating || !selectedUser || !basicSalary}
            startIcon={isGenerating ? <CircularProgress size={20} color="inherit" /> : null}
          >
            Generate
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
export default PayrollList;
