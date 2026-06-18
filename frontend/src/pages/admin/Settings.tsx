import { useState, useEffect } from 'react';
import { Box, Typography, Paper, Grid, TextField, Button, CircularProgress, Alert } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { useGetSettingsQuery, useUpdateSettingsMutation } from '../../store/api/settingsApiSlice';
const Settings = () => {
  const { data: response, isLoading } = useGetSettingsQuery({});
  const [updateSettings, { isLoading: isUpdating }] = useUpdateSettingsMutation();
  const [lat, setLat] = useState<number>(0);
  const [lng, setLng] = useState<number>(0);
  const [radius, setRadius] = useState<number>(100);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  useEffect(() => {
    if (response?.data) {
      setLat(response.data.geofenceCenter?.lat || 0);
      setLng(response.data.geofenceCenter?.lng || 0);
      setRadius(response.data.geofenceRadius || 100);
    }
  }, [response]);
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setErrorMsg('Geolocation is not supported by your browser');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLat(position.coords.latitude);
        setLng(position.coords.longitude);
        setIsLocating(false);
      },
      (error) => {
        setIsLocating(false);
        setErrorMsg('Failed to retrieve location: ' + error.message);
      }
    );
  };
  const handleSave = async () => {
    setSuccessMsg(null);
    setErrorMsg(null);
    try {
      await updateSettings({
        geofenceCenter: { lat, lng },
        geofenceRadius: radius
      }).unwrap();
      setSuccessMsg('Settings updated successfully.');
    } catch (err: any) {
      setErrorMsg(err.data?.error || err.error || 'Failed to update settings');
    }
  };
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 4 }}>
        System Settings
      </Typography>
      {successMsg && <Alert severity="success" sx={{ mb: 3 }}>{successMsg}</Alert>}
      {errorMsg && <Alert severity="error" sx={{ mb: 3 }}>{errorMsg}</Alert>}
      <Paper sx={{ p: 4, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Attendance Geofencing
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1, maxWidth: 500 }}>
              Set the central coordinate (latitude and longitude) of the office and the maximum allowed radius (in meters). 
              Employees attempting to clock in outside this radius will be blocked and their attempt will be logged as a violation.
            </Typography>
          </Box>
          <Button
            variant="outlined"
            onClick={handleGetLocation}
            disabled={isLocating}
            startIcon={isLocating ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {isLocating ? 'Locating...' : 'Use Current Location'}
          </Button>
        </Box>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Latitude"
              type="number"
              value={lat}
              onChange={(e) => setLat(parseFloat(e.target.value))}
              helperText="e.g. 40.7128"
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Longitude"
              type="number"
              value={lng}
              onChange={(e) => setLng(parseFloat(e.target.value))}
              helperText="e.g. -74.0060"
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Allowed Radius (meters)"
              type="number"
              value={radius}
              onChange={(e) => setRadius(parseInt(e.target.value))}
              helperText="e.g. 100"
            />
          </Grid>
        </Grid>
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={isUpdating ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
            onClick={handleSave}
            disabled={isUpdating}
          >
            Save Settings
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};
export default Settings;
