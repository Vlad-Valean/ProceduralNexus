import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Checkbox,
  FormControlLabel,
  Button,
  Divider,
  Link as MuiLink,
  Stack,
  IconButton,
  InputAdornment,
  Alert,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { registerApi } from '../services/authService';
import { useNavigate } from 'react-router-dom';

type FormData = {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  acceptDataProcessing: boolean;
};

type FormErrors = {
  firstname?: string;
  lastname?: string;
  email?: string;
  password?: string;
  acceptDataProcessing?: string;
};

const Register: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    acceptDataProcessing: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const [apiError, setApiError] = useState<string | null>(null);
  const [apiSuccess, setApiSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange =
    (field: keyof FormData) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value =
        field === 'acceptDataProcessing'
          ? event.target.checked
          : event.target.value;

      setFormData(prev => ({
        ...prev,
        [field]: value as FormData[typeof field],
      }));

      setErrors(prev => ({ ...prev, [field]: undefined }));
    };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.firstname.trim()) {
      newErrors.firstname = 'First name is required.';
    }

    if (!formData.lastname.trim()) {
      newErrors.lastname = 'Last name is required.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = 'Email is required.';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!formData.password) {
      newErrors.password = 'Password is required.';
    } else if (!passwordRegex.test(formData.password)) {
      newErrors.password =
        'Password must be at least 8 characters and include upper and lower case letters and a number.';
    }

    if (!formData.acceptDataProcessing) {
      newErrors.acceptDataProcessing =
        'You must agree to the processing of your personal data.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setApiError(null);
    setApiSuccess(null);
    setLoading(true);

    try {
      const msg = await registerApi({
        firstname: formData.firstname,
        lastname: formData.lastname,
        email: formData.email,
        password: formData.password,
      });

      setApiSuccess(msg || 'User registered successfully!');

      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err: any) {
      console.error('Register error:', err);
      setApiError(err.message || 'Registration failed');
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

  return (
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
          Register
        </Typography>

        {apiError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {apiError}
          </Alert>
        )}

        {apiSuccess && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {apiSuccess}
          </Alert>
        )}

        <Stack spacing={3}>
          {/* First name */}
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
              First name
            </Typography>
            <TextField
              fullWidth
              placeholder="John"
              size="medium"
              value={formData.firstname}
              onChange={handleChange('firstname')}
              error={Boolean(errors.firstname)}
              helperText={errors.firstname}
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

          {/* Last name */}
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
              Last name
            </Typography>
            <TextField
              fullWidth
              placeholder="Doe"
              size="medium"
              value={formData.lastname}
              onChange={handleChange('lastname')}
              error={Boolean(errors.lastname)}
              helperText={errors.lastname}
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

          {/* Data processing consent checkbox */}
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.acceptDataProcessing}
                onChange={handleChange('acceptDataProcessing')}
                sx={{
                  color: '#67728A',
                  '&.Mui-checked': {
                    color: '#67728A',
                  },
                }}
              />
            }
            label="I agree to the processing of my personal data in accordance with the Privacy Policy."
            sx={{
              m: 0,
              alignItems: 'flex-start',
              color: '#4b5563',
              '& .MuiFormControlLabel-label': {
                textAlign: 'left',
                whiteSpace: 'normal',
                fontSize: 14,
                lineHeight: 1.4,
              },
            }}
          />
          {errors.acceptDataProcessing && (
            <Typography
              variant="caption"
              sx={{ color: 'error.main', mt: 0.5, ml: 4.5 }}
            >
              {errors.acceptDataProcessing}
            </Typography>
          )}

          {/* Sign up button */}
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
            {loading ? 'Signing up...' : 'Sign up'}
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
            Sign up with Google
          </Button>

          <Typography
            variant="body2"
            sx={{
              color: '#6b7280',
              textAlign: 'center',
              mt: 1,
            }}
          >
            Already have an account?{' '}
            <MuiLink
              href="/login"
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
              Sign in
            </MuiLink>
          </Typography>
        </Stack>
      </Paper>
    </Box>
  );
};

export default Register;
