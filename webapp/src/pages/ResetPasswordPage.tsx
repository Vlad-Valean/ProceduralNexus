import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { TextField, Button, Paper, Typography, Box, Alert, InputAdornment, IconButton, Snackbar } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { confirmPasswordReset } from '../services/authService';

const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [,setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarType, setSnackbarType] = useState<'error' | 'success'>('error');
  const [snackbarMsg, setSnackbarMsg] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSnackbarOpen(false);
    if (!newPassword || !confirmPassword) {
      setError('All fields are required.');
      setSnackbarType('error');
      setSnackbarMsg('All fields are required.');
      setSnackbarOpen(true);
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      setSnackbarType('error');
      setSnackbarMsg('Passwords do not match.');
      setSnackbarOpen(true);
      return;
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      setError('Password must be at least 8 characters and include upper and lower case letters and a number.');
      setSnackbarType('error');
      setSnackbarMsg('Password must be at least 8 characters and include upper and lower case letters and a number.');
      setSnackbarOpen(true);
      return;
    }
    setLoading(true);
    try {
      await confirmPasswordReset(token, newPassword);
      setSuccess(true);
      setSnackbarType('success');
      setSnackbarMsg('Password reset! Redirecting to login...');
      setSnackbarOpen(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (e: unknown) {
        if (e && typeof e === 'object' && 'message' in e) {
          let msg = (e as { message?: string }).message || 'Failed to reset password.';
          if (msg.includes('Invalid or expired token') || msg.includes('BAD_REQUEST')) {
            msg = 'Your password reset link is invalid or has expired. Please request a new password reset.';
          }
          setError(msg);
          setSnackbarType('error');
          setSnackbarMsg(msg);
          setSnackbarOpen(true);
        } else {
          setError('Failed to reset password.');
          setSnackbarType('error');
          setSnackbarMsg('Failed to reset password.');
          setSnackbarOpen(true);
        }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#cfd6e0', px: 2 }}>
      <Paper sx={{ p: 4, borderRadius: 4, maxWidth: 400, width: '100%' }}>
        <Typography variant="h5" fontWeight={700} mb={2}>Reset Password</Typography>
        {/* Snackbar for error/success messages */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3500}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarType} sx={{ width: '100%' }}>
            {snackbarMsg}
          </Alert>
        </Snackbar>
        <form onSubmit={handleSubmit}>
          <TextField
            label="New Password"
            type={showNewPassword ? 'text' : 'password'}
            fullWidth
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            sx={{ mb: 2, mt: 2}}
            disabled={loading || success}
            autoComplete="off"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                    onClick={() => setShowNewPassword((show) => !show)}
                    edge="end"
                    tabIndex={-1}
                    disableRipple
                    sx={{
                      border: 'none',
                      boxShadow: 'none',
                      outline: 'none',
                      background: 'none',
                      '&:focus': { border: 'none', outline: 'none', boxShadow: 'none', background: 'none' },
                      '&:active': { border: 'none', outline: 'none', boxShadow: 'none', background: 'none' },
                      '&:hover': { border: 'none', outline: 'none', boxShadow: 'none', background: 'none' },
                    }}
                  >
                    {showNewPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="Confirm Password"
            type={showConfirmPassword ? 'text' : 'password'}
            fullWidth
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            sx={{ mb: 2}}
            disabled={loading || success}
            autoComplete="off"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    onClick={() => setShowConfirmPassword((show) => !show)}
                    edge="end"
                    tabIndex={-1}
                    disableRipple
                    sx={{
                      border: 'none',
                      boxShadow: 'none',
                      outline: 'none',
                      background: 'none',
                      '&:focus': { border: 'none', outline: 'none', boxShadow: 'none', background: 'none' },
                      '&:active': { border: 'none', outline: 'none', boxShadow: 'none', background: 'none' },
                      '&:hover': { border: 'none', outline: 'none', boxShadow: 'none', background: 'none' },
                    }}
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading || success}
            sx={{
              mt: 1,
              fontWeight: 600,
              fontSize: 16,
              textTransform: 'none',
              borderRadius: 1,
              py: 1.4,
              bgcolor: '#6f7688',
              boxShadow: 'none',
              border: '2px solid #6f7688',
              '&:hover': {
                bgcolor: '#636a7b',
                boxShadow: 'none',
                border: '2px solid #636a7b',
              },
              '&:focus': {
                border: '2px solid #636a7b',
                outline: 'none',
              },
              '&:active': {
                border: '2px solid #636a7b',
                outline: 'none',
              },
            }}
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default ResetPasswordPage;
