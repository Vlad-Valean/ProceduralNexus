import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Grid,
  MenuItem,
  Select,
  FormControl
} from '@mui/material';

const timezoneOptions = [
  { value: 'Europe/Bucharest', label: 'Europe/Bucharest' },
  { value: 'America/New_York', label: 'America/New York' },
  { value: 'America/Los_Angeles', label: 'America/Los Angeles' },
  { value: 'Europe/London', label: 'Europe/London' },
  { value: 'Asia/Tokyo', label: 'Asia/Tokyo' }
];

const Profile: React.FC = () => {
  const [useDefaultSignature, setUseDefaultSignature] = useState(true);
  const [formData, setFormData] = useState({
    fullName: 'Maria Brown',
    email: 'maria.brown@example.com',
    organization: 'Acme Corp',
    role: 'Standard user',
    phone: '',
    timezone: 'Europe/Bucharest'
  });

  const textFieldSx = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '10px',
      backgroundColor: 'white',
      fontSize: '14px',
      fontFamily: 'Inter, system-ui, Helvetica, Arial, sans-serif',
      '& fieldset': { borderColor: '#E6E8EE' },
      '&:hover fieldset': { borderColor: '#67728A' },
      '&.Mui-focused fieldset': { borderColor: '#67728A' }
    }
  };

  const disabledTextFieldSx = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '10px',
      backgroundColor: '#F8FAFC',
      fontSize: '14px',
      fontFamily: 'Inter, system-ui, Helvetica, Arial, sans-serif',
      '& fieldset': { borderColor: '#E6E8EE' }
    }
  };

  const labelSx = {
    fontSize: '12px',
    fontWeight: 500,
    color: '#667085',
    mb: 0.5,
    display: 'block',
    fontFamily: 'Inter, system-ui, Helvetica, Arial, sans-serif'
  };

  const outlinedButtonSx = {
    color: '#222',
    borderColor: '#E6E8EE',
    textTransform: 'none',
    borderRadius: '10px',
    fontSize: '14px',
    fontFamily: 'Inter, system-ui, Helvetica, Arial, sans-serif',
    boxShadow: 'none !important',
    outline: 'none !important',
    '&:hover': {
      borderColor: '#67728A',
      backgroundColor: 'rgba(103, 114, 138, 0.04)'
    },
    '&:focus': {
      boxShadow: 'none !important',
      outline: 'none !important',
      borderColor: '#67728A'
    }
  };

  const primaryButtonSx = {
    backgroundColor: '#67728A',
    color: 'white',
    textTransform: 'none',
    borderRadius: '10px',
    px: 3,
    fontSize: '14px',
    fontFamily: 'Inter, system-ui, Helvetica, Arial, sans-serif',
    boxShadow: 'none !important',
    '&:hover': {
      backgroundColor: '#5a6276'
    }
  };

  return (
    <Box sx={{ minHeight: '100vh' }}>
      <Navbar />

      <Container maxWidth={false} sx={{ mt: 4, mb: 8, px: { xs: 1, sm: 4, md: 8 } }}>
        {/* Breadcrumb */}
        <Typography
          sx={{
            fontSize: '12px',
            color: '#667085',
            mb: 2,
            fontFamily: 'Inter, system-ui, Helvetica, Arial, sans-serif'
          }}
        >
          Dashboard / Profile
        </Typography>

        {/* Page Title */}
        <Typography
          variant="h2"
          sx={{
            fontSize: '20px',
            fontWeight: 600,
            color: '#111827',
            mb: 4,
            fontFamily: 'Inter, system-ui, Helvetica, Arial, sans-serif'
          }}
        >
          Your profile
        </Typography>

        <Grid container spacing={3}>
          {/* Left Column - Profile Information */}
          <Grid item xs={12} md={8}>
            <Paper
              sx={{
                p: 4,
                borderRadius: '12px',
                border: '1px solid #E6E8EE',
                boxShadow: '0px 8px 24px rgba(16, 24, 40, 0.08)',
                backgroundColor: 'white'
              }}
            >
              <Typography
                sx={{
                  fontSize: '20px',
                  fontWeight: 600,
                  mb: 3,
                  color: '#111827',
                  fontFamily: 'Inter, system-ui, Helvetica, Arial, sans-serif'
                }}
              >
                Profile information
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {/* Full Name */}
                <Box>
                  <Typography component="label" sx={labelSx}>
                    Full name
                  </Typography>
                  <TextField
                    fullWidth
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    autoComplete="off"
                    sx={textFieldSx}
                  />
                </Box>

                {/* Email */}
                <Box>
                  <Typography component="label" sx={labelSx}>
                    Email
                  </Typography>
                  <TextField
                    fullWidth
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    autoComplete="off"
                    sx={textFieldSx}
                  />
                </Box>

                {/* Organization (Read-only) */}
                <Box>
                  <Typography component="label" sx={labelSx}>
                    Organization
                  </Typography>
                  <TextField
                    fullWidth
                    value={formData.organization}
                    disabled
                    sx={disabledTextFieldSx}
                  />
                </Box>

                {/* Role (Read-only) */}
                <Box>
                  <Typography component="label" sx={labelSx}>
                    Role
                  </Typography>
                  <TextField
                    fullWidth
                    value={formData.role}
                    disabled
                    sx={disabledTextFieldSx}
                  />
                </Box>

                {/* Phone */}
                <Box>
                  <Typography component="label" sx={labelSx}>
                    Phone
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="Optional"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    autoComplete="off"
                    sx={textFieldSx}
                  />
                </Box>

                {/* Timezone */}
                <Box>
                  <Typography component="label" sx={labelSx}>
                    Timezone
                  </Typography>
                  <FormControl fullWidth>
                    <Select
                      value={formData.timezone}
                      onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                      sx={{
                        borderRadius: '10px',
                        fontSize: '14px',
                        fontFamily: 'Inter, system-ui, Helvetica, Arial, sans-serif',
                        '& .MuiOutlinedInput-notchedOutline': { borderColor: '#E6E8EE' },
                        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#67728A' },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#67728A' }
                      }}
                    >
                      {timezoneOptions.map((tz) => (
                        <MenuItem key={tz.value} value={tz.value}>
                          {tz.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </Box>

              {/* Action Buttons */}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
                <Button variant="outlined" sx={{ ...outlinedButtonSx, px: 3 }}>
                  Cancel
                </Button>
                <Button variant="contained" sx={primaryButtonSx}>
                  Save changes
                </Button>
              </Box>
            </Paper>
          </Grid>

          {/* Right Column */}
          <Grid item xs={12} md={4}>
            {/* E-signature Card */}
            <Paper
              sx={{
                p: 3,
                mb: 3,
                borderRadius: '12px',
                border: '1px solid #E6E8EE',
                boxShadow: '0px 8px 24px rgba(16, 24, 40, 0.08)',
                backgroundColor: 'white'
              }}
            >
              <Typography
                sx={{
                  fontSize: '20px',
                  fontWeight: 600,
                  mb: 2,
                  color: '#111827',
                  fontFamily: 'Inter, system-ui, Helvetica, Arial, sans-serif'
                }}
              >
                E‑signature
              </Typography>

              {/* Signature Preview */}
              <Box
                sx={{
                  width: '100%',
                  height: 120,
                  borderRadius: '10px',
                  border: '1px solid #E6E8EE',
                  backgroundColor: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 2
                }}
              >
                <Typography
                  sx={{
                    fontSize: '24px',
                    fontFamily: 'Brush Script MT, cursive',
                    color: '#111827'
                  }}
                >
                  {formData.fullName}
                </Typography>
              </Box>

              {/* Buttons */}
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <Button variant="outlined" fullWidth sx={outlinedButtonSx}>
                  Draw signature
                </Button>
                <Button variant="outlined" fullWidth sx={outlinedButtonSx}>
                  Upload image
                </Button>
              </Box>
              <Button
                variant="text"
                sx={{
                  color: '#98A2B3',
                  textTransform: 'none',
                  fontSize: '14px',
                  fontFamily: 'Inter, system-ui, Helvetica, Arial, sans-serif',
                  '&:hover': {
                    backgroundColor: 'rgba(152, 162, 179, 0.1)'
                  }
                }}
              >
                Clear
              </Button>

              {/* Toggle */}
              <Box sx={{ mt: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={useDefaultSignature}
                      onChange={(e) => setUseDefaultSignature(e.target.checked)}
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: '#67728A'
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                          backgroundColor: '#67728A'
                        }
                      }}
                    />
                  }
                  label={
                    <Typography
                      sx={{
                        fontSize: '14px',
                        color: '#111827',
                        fontFamily: 'Inter, system-ui, Helvetica, Arial, sans-serif'
                      }}
                    >
                      Use as default signature
                    </Typography>
                  }
                />
              </Box>
            </Paper>

            {/* Security Card */}
            <Paper
              sx={{
                p: 3,
                borderRadius: '12px',
                border: '1px solid #E6E8EE',
                boxShadow: '0px 8px 24px rgba(16, 24, 40, 0.08)',
                backgroundColor: 'white',
                minHeight: 240
              }}
            >
              <Typography
                sx={{
                  fontSize: '20px',
                  fontWeight: 600,
                  mb: 3,
                  color: '#111827',
                  fontFamily: 'Inter, system-ui, Helvetica, Arial, sans-serif'
                }}
              >
                Security
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {/* Change Password */}
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    pb: 3,
                    borderBottom: '1px solid #E6E8EE'
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: '14px',
                      color: '#111827',
                      fontFamily: 'Inter, system-ui, Helvetica, Arial, sans-serif'
                    }}
                  >
                    Change password
                  </Typography>
                  <Button variant="outlined" size="small" sx={outlinedButtonSx}>
                    Change
                  </Button>
                </Box>

                {/* Active Sessions */}
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    pb: 3,
                    borderBottom: '1px solid #E6E8EE'
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: '14px',
                      color: '#111827',
                      fontFamily: 'Inter, system-ui, Helvetica, Arial, sans-serif'
                    }}
                  >
                    Active sessions
                  </Typography>
                  <Button
                    variant="text"
                    size="small"
                    sx={{
                      color: '#67728A',
                      textTransform: 'none',
                      fontSize: '14px',
                      fontFamily: 'Inter, system-ui, Helvetica, Arial, sans-serif',
                      '&:hover': {
                        backgroundColor: 'rgba(103, 114, 138, 0.04)'
                      }
                    }}
                  >
                    View sessions
                  </Button>
                </Box>

                {/* Two-factor Authentication */}
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <Box>
                    <Typography
                      sx={{
                        fontSize: '14px',
                        color: '#111827',
                        mb: 0.5,
                        fontFamily: 'Inter, system-ui, Helvetica, Arial, sans-serif'
                      }}
                    >
                      Two‑factor authentication
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: '12px',
                        color: '#98A2B3',
                        fontFamily: 'Inter, system-ui, Helvetica, Arial, sans-serif'
                      }}
                    >
                      Off
                    </Typography>
                  </Box>
                  <Button variant="outlined" size="small" sx={outlinedButtonSx}>
                    Enable
                  </Button>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default Profile;