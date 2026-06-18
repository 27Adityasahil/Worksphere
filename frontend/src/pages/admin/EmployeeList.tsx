import { useState } from 'react';
import { 
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Button, Chip, IconButton, CircularProgress, Alert
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddIcon from '@mui/icons-material/Add';
import EmployeeForm from './EmployeeForm';
import EmployeeProfileModal from './EmployeeProfileModal';
import { useGetEmployeesQuery, useCreateEmployeeMutation } from '../../store/api/employeeApiSlice';
const EmployeeList = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const { data: response, isLoading, isError } = useGetEmployeesQuery({});
  const [createEmployee] = useCreateEmployeeMutation();
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<React.ReactNode | null>(null);
  const employees = response?.data || [];
  const handleAddEmployee = async (data: any) => {
    setFormError(null);
    setSuccessMessage(null);
    try {
      const res = await createEmployee(data).unwrap();
      setIsFormOpen(false);
      if (res.tempPassword) {
        setSuccessMessage(
          <>Employee created! Temporary password: <strong>{res.tempPassword}</strong></>
        );
      } else {
        setSuccessMessage('Employee created successfully.');
      }
    } catch (err: any) {
      console.error('Failed to create employee', err);
      setFormError(err.data?.error || err.error || 'Failed to add employee');
    }
  };
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Employees
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          color="primary"
          onClick={() => setIsFormOpen(true)}
        >
          Add Employee
        </Button>
      </Box>
      {successMessage && (
        <Alert severity="success" sx={{ mb: 4 }}>
          {successMessage}
        </Alert>
      )}
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : isError ? (
        <Alert severity="error" sx={{ mb: 4 }}>
          Failed to load employees. Please try again later.
        </Alert>
      ) : (
        <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: 2 }}>
          <TableContainer sx={{ maxHeight: 600 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f8fafc' }}>Employee ID</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f8fafc' }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f8fafc' }}>Department</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f8fafc' }}>Role</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f8fafc' }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f8fafc', textAlign: 'center' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {employees.map((employee: any) => (
                  <TableRow hover key={employee._id}>
                    <TableCell>{employee.employeeId || 'N/A'}</TableCell>
                    <TableCell sx={{ fontWeight: 500 }}>
                      {employee.firstName} {employee.lastName}
                    </TableCell>
                    <TableCell>{employee.department}</TableCell>
                    <TableCell>{employee.user?.role}</TableCell>
                    <TableCell>
                      <Chip 
                        label={employee.user?.isActive ? 'Active' : 'Inactive'} 
                        color={employee.user?.isActive ? 'success' : 'default'} 
                        size="small" 
                      />
                    </TableCell>
                    <TableCell align="center">
                      <IconButton 
                        color="info" 
                        size="small"
                        onClick={() => {
                          setSelectedEmployee(employee);
                          setIsProfileModalOpen(true);
                        }}
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                      <IconButton color="primary" size="small">
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton color="error" size="small">
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
      <EmployeeForm 
        open={isFormOpen} 
        onClose={() => {
          setIsFormOpen(false);
          setFormError(null);
        }} 
        onSubmit={handleAddEmployee}
        serverError={formError}
      />
      <EmployeeProfileModal 
        open={isProfileModalOpen}
        onClose={() => {
          setIsProfileModalOpen(false);
          setSelectedEmployee(null);
        }}
        employee={selectedEmployee}
      />
    </Box>
  );
};
export default EmployeeList;
