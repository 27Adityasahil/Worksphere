import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper, Divider, Alert, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SecurityIcon from '@mui/icons-material/Security';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import LockIcon from '@mui/icons-material/Lock';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../store/slices/authSlice';
import { useLoginMutation } from '../../store/api/authApiSlice';
interface LoginFormProps {
  type: 'admin' | 'employee';
}
const LoginForm: React.FC<LoginFormProps> = ({ type }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const [errorMsg, setErrorMsg] = useState('');
  const [formData, setFormData] = useState({
    identifier: '',
    password: ''
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      // Map identifier to email for backend
      const res = await login({ email: formData.identifier, password: formData.password }).unwrap();
      dispatch(setCredentials({ ...res.data }));
      if (res.data.isFirstLogin) {
        navigate('/reset-password', { state: { email: res.data.email } });
      } else {
        if (type === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/employee/dashboard');
        }
      }
    } catch (err: any) {
      setErrorMsg(err?.data?.error || 'Failed to login');
    }
  };
  return (
    <Box sx={{ maxWidth: 450, mx: 'auto', mt: 8 }}>
      <Paper elevation={0} sx={{ p: 4, borderRadius: 4, boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a', mb: 1 }}>
            {type === 'admin' ? 'Administrator Portal' : 'Employee Workspace'}
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b', mb: 2 }}>
            {type === 'admin' 
              ? 'Secure access for HR managers and organization admins' 
              : 'Access attendance, payroll, leaves and company updates'}
          </Typography>
          {errorMsg && (
            <Alert severity="error" sx={{ mb: 2, textAlign: 'left' }}>
              {errorMsg}
            </Alert>
          )}
          {type === 'admin' && (
            <Box sx={{ display: 'inline-flex', alignItems: 'center', backgroundColor: '#eff6ff', px: 2, py: 0.5, borderRadius: 2 }}>
              <SecurityIcon sx={{ fontSize: 16, color: '#2563EB', mr: 1 }} />
              <Typography variant="caption" sx={{ color: '#2563EB', fontWeight: 600 }}>
                Protected with enterprise authentication
              </Typography>
            </Box>
          )}
        </Box>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label={type === 'admin' ? "Email Address" : "Employee ID / Email"}
            name="identifier"
            variant="outlined"
            margin="normal"
            value={formData.identifier}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            variant="outlined"
            margin="normal"
            value={formData.password}
            onChange={handleChange}
            sx={{ mb: 3 }}
          />
          <Button
            fullWidth
            type="submit"
            variant="contained"
            size="large"
            disabled={isLoading}
            sx={{ 
              py: 1.5, 
              backgroundColor: type === 'admin' ? '#2563EB' : '#10b981',
              fontWeight: 700,
              borderRadius: 2,
              '&:hover': {
                backgroundColor: type === 'admin' ? '#1d4ed8' : '#059669',
              }
            }}
          >
            {isLoading ? <CircularProgress size={24} /> : (type === 'admin' ? 'Sign In' : 'Login')}
          </Button>
        </form>
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
          <Button 
            variant="text" 
            sx={{ textTransform: 'none', color: '#64748b' }}
            onClick={() => navigate('/login')}
          >
            ← Back to Portal Selection
          </Button>
        </Box>
        <Divider sx={{ my: 3 }} />
        {}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <VerifiedUserIcon sx={{ fontSize: 16 }} />
            <Typography variant="caption">Secure</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <SecurityIcon sx={{ fontSize: 16 }} />
            <Typography variant="caption">RBAC</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <LockIcon sx={{ fontSize: 16 }} />
            <Typography variant="caption">Encrypted</Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};
export default LoginForm;
