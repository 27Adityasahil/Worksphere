import { useState } from 'react';
import { TextField, Button, Box, Typography, Alert, CircularProgress } from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useResetPasswordMutation } from '../../store/api/authApiSlice';
import { setCredentials } from '../../store/slices/authSlice';
const resetPasswordSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  tempPassword: z.string().min(1, 'Temporary password is required'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your new password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});
type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
const ResetPasswordForm = () => {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const defaultEmail = location.state?.email || '';
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: defaultEmail,
    }
  });
  const onSubmit = async (data: ResetPasswordFormData) => {
    setErrorMsg(null);
    try {
      const res = await resetPassword(data).unwrap();
      dispatch(setCredentials({ ...res.data }));
      // Assuming they are logged in after reset, route them
      if (res.data.role === 'Admin' || res.data.role === 'Manager') {
        navigate('/admin/dashboard');
      } else {
        navigate('/employee/dashboard');
      }
    } catch (err: any) {
      setErrorMsg(err?.data?.error || 'Failed to reset password. Please try again.');
    }
  };
  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Typography variant="h4" component="h1" sx={{ textAlign: 'center', mb: 2, fontWeight: 800, color: '#0f172a' }}>
        Welcome to WorkSphere 🎉
      </Typography>
      <Typography variant="body1" sx={{ textAlign: 'center', mb: 4, color: '#64748b' }}>
        Your account was created by your HR administrator.<br />
        For security reasons, create your new password.
      </Typography>
      {errorMsg && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorMsg}
        </Alert>
      )}
      <TextField
        margin="normal"
        required
        fullWidth
        id="email"
        label="Email Address"
        autoComplete="email"
        {...register('email')}
        error={!!errors.email}
        helperText={errors.email?.message}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        label="Temporary Password"
        type="password"
        id="tempPassword"
        {...register('tempPassword')}
        error={!!errors.tempPassword}
        helperText={errors.tempPassword?.message}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        label="New Password"
        type="password"
        id="newPassword"
        {...register('newPassword')}
        error={!!errors.newPassword}
        helperText={errors.newPassword?.message}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        label="Confirm New Password"
        type="password"
        id="confirmPassword"
        {...register('confirmPassword')}
        error={!!errors.confirmPassword}
        helperText={errors.confirmPassword?.message}
      />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        size="large"
        disabled={isLoading}
        sx={{ mt: 3, mb: 2, py: 1.5 }}
      >
        {isLoading ? <CircularProgress size={24} /> : 'Update Password'}
      </Button>
    </Box>
  );
};
export default ResetPasswordForm;
