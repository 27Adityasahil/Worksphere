import { Box, Typography, Paper, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PersonIcon from '@mui/icons-material/Person';
const Login = () => {
  const navigate = useNavigate();
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a', mb: 1 }}>
          Welcome Back
        </Typography>
        <Typography variant="subtitle1" sx={{ color: '#64748b' }}>
          Choose your workspace to continue
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4, justifyContent: 'center' }}>
        {}
        <Paper 
          elevation={0}
          onClick={() => navigate('/login/admin')}
          sx={{ 
            p: 5, 
            flex: 1,
            maxWidth: '350px',
            textAlign: 'center',
            cursor: 'pointer',
            borderRadius: 4,
            border: '2px solid transparent',
            boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
            transition: 'all 0.3s ease',
            '&:hover': {
              borderColor: '#2563EB',
              transform: 'translateY(-4px)',
              boxShadow: '0 20px 25px -5px rgba(37,99,235,0.15)'
            }
          }}
        >
          <Box sx={{ 
            backgroundColor: '#eff6ff', 
            width: 80, 
            height: 80, 
            borderRadius: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            mx: 'auto',
            mb: 3
          }}>
            <AdminPanelSettingsIcon sx={{ fontSize: 40, color: '#2563EB' }} />
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#0f172a', mb: 1 }}>
            Administrator
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b' }}>
            Manage HR, payroll, and organization settings
          </Typography>
        </Paper>
        {}
        <Paper 
          elevation={0}
          onClick={() => navigate('/login/employee')}
          sx={{ 
            p: 5, 
            flex: 1,
            maxWidth: '350px',
            textAlign: 'center',
            cursor: 'pointer',
            borderRadius: 4,
            border: '2px solid transparent',
            boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
            transition: 'all 0.3s ease',
            '&:hover': {
              borderColor: '#10b981',
              transform: 'translateY(-4px)',
              boxShadow: '0 20px 25px -5px rgba(16,185,129,0.15)'
            }
          }}
        >
          <Box sx={{ 
            backgroundColor: '#ecfdf5', 
            width: 80, 
            height: 80, 
            borderRadius: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            mx: 'auto',
            mb: 3
          }}>
            <PersonIcon sx={{ fontSize: 40, color: '#10b981' }} />
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#0f172a', mb: 1 }}>
            Employee
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b' }}>
            Access attendance, leaves, and your profile
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};
export default Login;
