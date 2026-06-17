import { Box, Typography, Button, Container, Grid, Paper, AppBar, Toolbar, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PeopleIcon from '@mui/icons-material/People';
import EventNoteIcon from '@mui/icons-material/EventNote';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SecurityIcon from '@mui/icons-material/Security';
import dashboardPreview from '../assets/dashboard_preview.png';
const Landing = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#F8FAFC' }}>
      {}
      <AppBar position="static" elevation={0} sx={{ backgroundColor: 'transparent', py: 2 }}>
        <Container maxWidth="lg">
          <Toolbar sx={{ justifyContent: 'space-between', px: '0 !important' }}>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#2563EB', letterSpacing: '-0.5px' }}>
              WorkSphere
            </Typography>
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 4, alignItems: 'center' }}>
              <Typography variant="body2" sx={{ cursor: 'pointer', fontWeight: 600, color: '#64748b', '&:hover': { color: '#0f172a' } }}>Features</Typography>
              <Typography variant="body2" sx={{ cursor: 'pointer', fontWeight: 600, color: '#64748b', '&:hover': { color: '#0f172a' } }}>Security</Typography>
              <Typography variant="body2" sx={{ cursor: 'pointer', fontWeight: 600, color: '#64748b', '&:hover': { color: '#0f172a' } }}>Modules</Typography>
              <Typography variant="body2" sx={{ cursor: 'pointer', fontWeight: 600, color: '#64748b', '&:hover': { color: '#0f172a' } }}>Demo</Typography>
            </Box>
            <Box>
              <Button 
                variant="outlined" 
                sx={{ mr: 2, borderRadius: 2, textTransform: 'none', px: 3, fontWeight: 600, borderColor: '#e2e8f0', color: '#0f172a' }}
                onClick={() => navigate('/login/employee')}
              >
                Employee Login
              </Button>
              <Button 
                variant="contained" 
                sx={{ borderRadius: 2, textTransform: 'none', px: 3, fontWeight: 600, backgroundColor: '#2563EB', boxShadow: '0 4px 14px 0 rgba(37,99,235,0.39)' }}
                onClick={() => navigate('/login/admin')}
              >
                Admin Login
              </Button>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      {}
      <Container maxWidth="lg" sx={{ pt: 10, pb: 6, textAlign: 'center' }}>
        <Typography 
          variant="h1" 
          sx={{ 
            fontSize: { xs: '2.5rem', md: '4rem' }, 
            fontWeight: 900, 
            color: '#0f172a',
            mb: 3,
            lineHeight: 1.1,
            letterSpacing: '-1px'
          }}
        >
          Modern Workforce <br />
          <Box component="span" sx={{ color: '#2563EB' }}>Management Platform</Box>
        </Typography>
        <Typography 
          variant="h6" 
          sx={{ 
            color: '#64748b', 
            mb: 6, 
            maxWidth: '700px', 
            mx: 'auto',
            fontWeight: 400,
            lineHeight: 1.6
          }}
        >
          Automate HR operations, attendance tracking, payroll processing and employee management with an intelligent HRMS solution.
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 8 }}>
          <Button 
            variant="contained" 
            size="large"
            onClick={() => navigate('/login/admin')}
            sx={{ 
              borderRadius: 8, px: 5, py: 1.5, fontSize: '1.05rem', fontWeight: 600,
              backgroundColor: '#0f172a',
              '&:hover': { backgroundColor: '#334155' }
            }}
          >
            Admin Portal
          </Button>
          <Button 
            variant="contained" 
            size="large"
            onClick={() => navigate('/login/employee')}
            sx={{ 
              borderRadius: 8, px: 5, py: 1.5, fontSize: '1.05rem', fontWeight: 600,
              backgroundColor: '#2563EB',
              boxShadow: '0 10px 25px -5px rgba(37,99,235,0.5)',
              '&:hover': { backgroundColor: '#1d4ed8' }
            }}
          >
            Employee Portal
          </Button>
        </Box>
        {}
        <Box sx={{ mx: 'auto', maxWidth: '1000px', mt: 4, position: 'relative' }}>
          <Box 
            component="img"
            src={dashboardPreview}
            alt="Dashboard Preview"
            sx={{
              width: '100%',
              borderRadius: 4,
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              border: '1px solid #e2e8f0'
            }}
          />
        </Box>
      </Container>
      {}
      <Box sx={{ backgroundColor: 'white', py: 12 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" sx={{ textAlign: 'center', fontWeight: 800, mb: 8, color: '#0f172a' }}>
            Everything you need
          </Typography>
          <Grid container spacing={4}>
            {[
              {
                icon: <PeopleIcon sx={{ fontSize: 40, color: 'var(--primary)' }} />,
                title: 'Employee Profiles',
                desc: 'Centralized database for all employee records, documents, and historical data.'
              },
              {
                icon: <EventNoteIcon sx={{ fontSize: 40, color: '#10b981' }} />,
                title: 'Leave Management',
                desc: 'Streamlined request and approval workflows for time off and sick leaves.'
              },
              {
                icon: <AssessmentIcon sx={{ fontSize: 40, color: '#f59e0b' }} />,
                title: 'Performance & Payroll',
                desc: 'Integrated payroll processing and performance review tracking.'
              },
              {
                icon: <SecurityIcon sx={{ fontSize: 40, color: '#8b5cf6' }} />,
                title: 'Role-Based Access',
                desc: 'Secure portals separated for employees, managers, and administrators.'
              }
            ].map((feature, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                <Paper 
                  elevation={0}
                  sx={{ 
                    p: 4, 
                    height: '100%',
                    borderRadius: 4, 
                    backgroundColor: '#f8fafc',
                    transition: 'transform 0.3s',
                    '&:hover': { transform: 'translateY(-8px)', backgroundColor: 'white', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }
                  }}
                >
                  <Box sx={{ mb: 3 }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: '#0f172a' }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#64748b', lineHeight: 1.6 }}>
                    {feature.desc}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};
export default Landing;
