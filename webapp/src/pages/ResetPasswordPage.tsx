import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { TextField, Button, Paper, Typography, Box, Alert, InputAdornment, IconButton } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { confirmPasswordReset } from '../services/authService';

const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!newPassword || !confirmPassword) {
      setError('All fields are required.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      await confirmPasswordReset(token, newPassword);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (e: unknown) {
        if (e && typeof e === 'object' && 'message' in e) {
          setError((e as { message?: string }).message || 'Failed to reset password.');
        } else {
          setError('Failed to reset password.');
        }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#cfd6e0', px: 2 }}>
      <Paper sx={{ p: 4, borderRadius: 4, maxWidth: 400, width: '100%' }}>
        <Typography variant="h5" fontWeight={700} mb={2}>Reset Password</Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>Password reset! Redirecting to login...</Alert>}
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
