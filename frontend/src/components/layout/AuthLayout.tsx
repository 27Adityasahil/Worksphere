import { Box, Paper, Typography, Container, ThemeProvider, createTheme } from '@mui/material';
import { Outlet } from 'react-router-dom';
const theme = createTheme({
  palette: {
    primary: {
      main: '#2563eb', 
    },
    secondary: {
      main: '#1e40af',
    },
    background: {
      default: '#f8fafc',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  shape: {
    borderRadius: 8,
  },
});
const AuthLayout = () => {
  return (
    <ThemeProvider theme={theme}>
      <Box 
        sx={{ 
          minHeight: '100vh', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          backgroundColor: 'background.default',
          backgroundImage: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
        }}
      >
        <Container maxWidth="sm">
          <Paper 
            elevation={10} 
            sx={{ 
              p: 4, 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              backdropFilter: 'blur(10px)',
              backgroundColor: 'rgba(255, 255, 255, 0.9)'
            }}
          >
            <Box sx={{ mb: 4, textAlign: 'center' }}>
              <Typography variant="h4" component="h1" color="primary" sx={{ fontWeight: 'bold' }}>
                WorkSphere
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Human Resource Management System
              </Typography>
            </Box>
            <Box sx={{ width: '100%' }}>
              <Outlet />
            </Box>
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
};
export default AuthLayout;
