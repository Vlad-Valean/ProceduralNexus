import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Divider,
  Link as MuiLink,
  Stack,
  IconButton,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { loginApi } from '../services/authService';
import { useNavigate } from 'react-router-dom';

type FormData = {
  email: string;
  password: string;
};

type FormErrors = {
  email?: string;
  password?: string;
};

type JwtResponse = {
  accessToken?: string;
  token?: string;
  jwt?: string;
  email?: string;
  roles?: string[];
};

const Login: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const [resetOpen, setResetOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetError, setResetError] = useState<string | undefined>();

  const [apiError, setApiError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange =
    (field: keyof FormData) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;

      setFormData(prev => ({
        ...prev,
        [field]: value,
      }));

      setErrors(prev => ({ ...prev, [field]: undefined }));
    };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required.';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setApiError(null);
    setLoading(true);

    try {
      const jwt: JwtResponse = await loginApi({
        email: formData.email,
        password: formData.password,
      });

      const token = jwt.accessToken || jwt.token || jwt.jwt || "";
      localStorage.setItem('token', token);

      localStorage.setItem('userEmail', jwt.email ?? '');
      localStorage.setItem('userRoles', JSON.stringify(jwt.roles ?? []));
      
      console.log("All localStorage values:");
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          console.log(`${key}:`, localStorage.getItem(key));
        }
      }

      navigate('/'); 
    } catch (err: unknown) {
        if (err instanceof Error) {
          console.error('Login error:', err);
          setApiError(err.message || 'Login failed');
        } else {
          setApiError('Login failed');
        }
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleOpenReset = () => {
    setResetEmail('');
    setResetError(undefined);
    setResetOpen(true);
  };

  const handleCloseReset = () => {
    setResetOpen(false);
  };

  const handleResetContinue = () => {
    if (!resetEmail.trim()) {
      setResetError('Email is required.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(resetEmail)) {
      setResetError('Please enter a valid email address.');
      return;
    }

    console.log('Send reset link to:', resetEmail);
    setResetOpen(false);
  };

  return (
    <>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: '#cfd6e0',
          px: 2,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            width: '100%',
            maxWidth: 380,
            borderRadius: 6,
            p: { xs: 4, sm: 6 },
            boxShadow:
              '0 30px 80px rgba(15, 23, 42, 0.16), 0 0 0 1px rgba(148, 163, 184, 0.12)',
            bgcolor: '#ffffff',
          }}
        >
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontWeight: 700,
              color: '#111827',
              mb: 4,
              textAlign: 'center',
              fontSize: 40,
            }}
          >
            Login
          </Typography>

          {apiError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {apiError}
            </Alert>
          )}

          <Stack spacing={3}>
            {/* Email */}
            <Box>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 500,
                  color: '#4b5563',
                  mb: 0.75,
                  textAlign: 'left',
                }}
              >
                Email
              </Typography>
              <TextField
                fullWidth
                type="email"
                placeholder="your@email.com"
                size="medium"
                value={formData.email}
                onChange={handleChange('email')}
                error={Boolean(errors.email)}
                helperText={errors.email}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 4,
                    bgcolor: '#f4f6fb',
                    height: 52,
                    '& fieldset': {
                      borderColor: '#dde3f0',
                    },
                    '&:hover fieldset': {
                      borderColor: '#cfd6e6',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#a5b1c8',
                    },
                  },
                }}
              />
            </Box>

            {/* Password */}
            <Box>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 500,
                  color: '#4b5563',
                  mb: 0.75,
                  textAlign: 'left',
                }}
              >
                Password
              </Typography>
              <TextField
                fullWidth
                type={showPassword ? 'text' : 'password'}
                placeholder="•••••••••••"
                size="medium"
                value={formData.password}
                onChange={handleChange('password')}
                error={Boolean(errors.password)}
                helperText={errors.password}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 4,
                    bgcolor: '#f4f6fb',
                    height: 52,
                    '& fieldset': {
                      borderColor: '#dde3f0',
                    },
                    '&:hover fieldset': {
                      borderColor: '#cfd6e6',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#a5b1c8',
                    },
                  },
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label={
                          showPassword ? 'Hide password' : 'Show password'
                        }
                        onClick={handleTogglePasswordVisibility}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            {/* Reset password link */}
            <Typography
              variant="body2"
              sx={{
                color: '#6b7280',
                textAlign: 'left',
                mt: 1,
              }}
            >
              Forgot your password?{' '}
              <MuiLink
                component="button"
                type="button"
                underline="hover"
                onClick={handleOpenReset}
                sx={{
                  fontWeight: 500,
                  color: '#374151',
                  transition: 'color 0.2s',
                  '&:hover': {
                    color: '#6b7280',
                    fontWeight: 500,
                  },
                }}
              >
                Reset it here
              </MuiLink>
            </Typography>

            {/* Sign in button */}
            <Button
              variant="contained"
              fullWidth
              size="large"
              onClick={handleSubmit}
              disabled={loading}
              sx={{
                mt: 1,
                fontWeight: 600,
                textTransform: 'none',
                borderRadius: 4,
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
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>

            <Divider sx={{ my: 1.5, color: '#cbd0dc' }}>or</Divider>

            {/* Google button */}
            <Button
              variant="outlined"
              fullWidth
              size="medium"
              startIcon={
                <Box component="span" sx={{ display: 'flex' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                </Box>
              }
              sx={{
                textTransform: 'none',
                fontWeight: 500,
                borderRadius: 4,
                py: 1.2,
                borderColor: '#dde3f0',
                bgcolor: '#ffffff',
                color: '#374151',
                boxShadow: 'none',
                '&:hover': {
                  bgcolor: '#f5f7fb',
                  borderColor: '#cfd6e6',
                  boxShadow: 'none',
                },
                '&:focus': {
                  border: '2px solid #cfd6e6',
                  outline: 'none',
                },
                '&:active': {
                  border: '2px solid #cfd6e6',
                  outline: 'none',
                },
              }}
            >
              Sign in using Google
            </Button>

            <Typography
              variant="body2"
              sx={{
                color: '#6b7280',
                textAlign: 'center',
                mt: 1,
              }}
            >
              Don't have an account?{' '}
              <MuiLink
                href="/register"
                underline="hover"
                sx={{
                  fontWeight: 500,
                  color: '#374151',
                  transition: 'color 0.2s',
                  '&:hover': {
                    color: '#6b7280',
                    fontWeight: 500,
                  },
                }}
              >
                Create now
              </MuiLink>
            </Typography>
          </Stack>
        </Paper>
      </Box>

      {/* Reset password modal */}
      <Dialog
        open={resetOpen}
        onClose={handleCloseReset}
        maxWidth="sm"
        fullWidth
        slotProps={{
          backdrop: {
            sx: {
              backgroundColor: 'rgba(15,23,42,0.65)',
            },
          },
        }}
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 2,
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 600, fontSize: 20 }}>
          Reset password
        </DialogTitle>

        <DialogContent sx={{ pt: 1 }}>
          <Typography variant="body2" sx={{ color: '#4b5563', mb: 2 }}>
            Enter your account&apos;s email address, and we&apos;ll send you a
            link to reset your password.
          </Typography>

          <TextField
            fullWidth
            type="email"
            placeholder="Email address"
            value={resetEmail}
            onChange={e => {
              setResetEmail(e.target.value);
              setResetError(undefined);
            }}
            error={Boolean(resetError)}
            helperText={resetError}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 3.5,
                bgcolor: '#f4f6fb',
                height: 48,
                overflow: 'hidden',
                '& fieldset': {
                  borderColor: '#dde3f0',
                  borderRadius: 3.5,
                },
                '&:hover fieldset': {
                  borderColor: '#dde3f0',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#dde3f0',
                },
              },
              '& input:-webkit-autofill': {
              },
            }}
          />
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2, gap: 1.5 }}>
          <Button
            onClick={handleCloseReset}
            sx={{
              textTransform: 'none',
              color: '#4b5563',
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleResetContinue}
            sx={{
              textTransform: 'none',
              borderRadius: 3.25,
              px: 3,
              bgcolor: '#111827',
              boxShadow: 'none',
              '&:hover': {
              },
            }}
          >
            Continue
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Login;
