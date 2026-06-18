const fs = require('fs');
const path = require('path');

function replaceInFile(filePath, replacements) {
  let content = fs.readFileSync(filePath, 'utf8');
  for (const [regex, replacement] of replacements) {
    content = content.replace(regex, replacement);
  }
  fs.writeFileSync(filePath, content, 'utf8');
}

const dir = 'd:/new portfolio projects/hrms/frontend/src';

// 1. EmployeeSidebar.tsx
replaceInFile(path.join(dir, 'components/layout/EmployeeSidebar.tsx'), [
  [
    /slotProps=\{\{\s*primary: \{\s*fontWeight:\s*([^,]+),\s*color:\s*([^}]+)\s*\}\s*\}\}/g,
    'slotProps={{ primary: { sx: { fontWeight: $1, color: $2 } } }}'
  ]
]);

// 2. Sidebar.tsx
replaceInFile(path.join(dir, 'components/layout/Sidebar.tsx'), [
  [
    /slotProps=\{\{\s*primary: \{\s*fontWeight:\s*([^,]+),\s*color:\s*([^}]+)\s*\}\s*\}\}/g,
    'slotProps={{ primary: { sx: { fontWeight: $1, color: $2 } } }}'
  ]
]);

// 3. Landing.tsx
replaceInFile(path.join(dir, 'pages/Landing.tsx'), [
  [/const theme = useTheme\(\);\s*/, '']
]);

// 4. AttendanceList.tsx
replaceInFile(path.join(dir, 'pages/admin/AttendanceList.tsx'), [
  [/const \{ data: violationsResponse, isLoading: isLoadingViolations \} = useGetViolationsQuery\(\{\}\);/, 'const { data: violationsResponse } = useGetViolationsQuery({});'],
  [/display="block"/g, "sx={{ display: 'block' }}"]
]);

// 5. Dashboard.tsx
replaceInFile(path.join(dir, 'pages/admin/Dashboard.tsx'), [
  [/fontWeight="bold"/g, "sx={{ fontWeight: 'bold' }}"],
  [/<Grid item xs=\{12\} sm=\{6\} md=\{3\}>/g, '<Grid size={{ xs: 12, sm: 6, md: 3 }}>']
]);

// 6. EmployeeList.tsx
replaceInFile(path.join(dir, 'pages/admin/EmployeeList.tsx'), [
  [/const \{ data: response, isLoading, isError, error \} = useGetEmployeesQuery\(\{\}\);/, 'const { data: response, isLoading, isError } = useGetEmployeesQuery({});'],
  [/const \[createEmployee, \{ isLoading: isCreating \}\] = useCreateEmployeeMutation\(\);/, 'const [createEmployee] = useCreateEmployeeMutation();']
]);

// 7. EmployeeProfileModal.tsx
replaceInFile(path.join(dir, 'pages/admin/EmployeeProfileModal.tsx'), [
  [/<Grid item xs=\{6\}>/g, '<Grid size={{ xs: 6 }}>'],
  [/<Grid item xs=\{12\}>/g, '<Grid size={{ xs: 12 }}>']
]);

// 8. PayrollList.tsx
replaceInFile(path.join(dir, 'pages/admin/PayrollList.tsx'), [
  [/import \{ Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, CircularProgress, Alert, Chip, IconButton \} from '@mui\/material';/, "import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, CircularProgress, Alert, Chip } from '@mui/material';"]
]);

// 9. Settings.tsx
replaceInFile(path.join(dir, 'pages/admin/Settings.tsx'), [
  [/<Grid item xs=\{12\} md=\{6\}>/g, '<Grid size={{ xs: 12, md: 6 }}>']
]);

// 10. EmployeeDashboard.tsx
replaceInFile(path.join(dir, 'pages/employee/EmployeeDashboard.tsx'), [
  [/import \{ useState, useEffect \} from 'react';/, "import { useState } from 'react';"],
  [/display="block"/g, "sx={{ display: 'block' }}"],
  [/fontWeight="bold"/g, "sx={{ fontWeight: 'bold' }}"],
  [/<Grid item xs=\{12\} sm=\{4\}>/g, '<Grid size={{ xs: 12, sm: 4 }}>'],
  [/<Grid item xs=\{12\} md=\{5\} lg=\{4\}>/g, '<Grid size={{ xs: 12, md: 5, lg: 4 }}>'],
  [/<Grid item xs=\{12\} md=\{7\} lg=\{8\}>/g, '<Grid size={{ xs: 12, md: 7, lg: 8 }}>']
]);

// 11. MyLeaves.tsx
replaceInFile(path.join(dir, 'pages/employee/MyLeaves.tsx'), [
  [/<Grid item xs=\{12\}>/g, '<Grid size={{ xs: 12 }}>'],
  [/<Grid item xs=\{12\} sm=\{6\}>/g, '<Grid size={{ xs: 12, sm: 6 }}>']
]);

console.log('Done!');
