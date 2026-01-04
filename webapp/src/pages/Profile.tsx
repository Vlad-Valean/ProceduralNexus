import Navbar from "../components/Navbar";
import { useState } from 'react';
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
  Select
} from '@mui/material';


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

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#F5F7FA' }}>
      <Navbar />

      <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
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
                  fontSize: '16px',
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
                  <Typography
                    component="label"
                    sx={{
                      fontSize: '12px',
                      fontWeight: 500,
                      color: '#667085',
                      mb: 0.5,
                      display: 'block',
                      fontFamily: 'Inter, system-ui, Helvetica, Arial, sans-serif'
                    }}
                  >
                    Full name
                  </Typography>
                  <TextField
                    fullWidth
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '10px',
                        backgroundColor: 'white',
                        fontSize: '14px',
                        fontFamily: 'Inter, system-ui, Helvetica, Arial, sans-serif'
                      }
                    }}
                  />
                </Box>

                {/* Email */}
                <Box>
                  <Typography
                    component="label"
                    sx={{
                      fontSize: '12px',
                      fontWeight: 500,
                      color: '#667085',
                      mb: 0.5,
                      display: 'block',
                      fontFamily: 'Inter, system-ui, Helvetica, Arial, sans-serif'
                    }}
                  >
                    Email
                  </Typography>
                  <TextField
                    fullWidth
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '10px',
                        backgroundColor: 'white',
                        fontSize: '14px',
                        fontFamily: 'Inter, system-ui, Helvetica, Arial, sans-serif'
                      }
                    }}
                  />
                </Box>

                {/* Organization (Read-only) */}
                <Box>
                  <Typography
                    component="label"
                    sx={{
                      fontSize: '12px',
                      fontWeight: 500,
                      color: '#667085',
                      mb: 0.5,
                      display: 'block',
                      fontFamily: 'Inter, system-ui, Helvetica, Arial, sans-serif'
                    }}
                  >
                    Organization
                  </Typography>
                  <TextField
                    fullWidth
                    value={formData.organization}
                    disabled
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '10px',
                        backgroundColor: '#F8FAFC',
                        fontSize: '14px',
                        fontFamily: 'Inter, system-ui, Helvetica, Arial, sans-serif'
                      }
                    }}
                  />
                </Box>

                {/* Role (Read-only) */}
                <Box>
                  <Typography
                    component="label"
                    sx={{
                      fontSize: '12px',
                      fontWeight: 500,
                      color: '#667085',
                      mb: 0.5,
                      display: 'block',
                      fontFamily: 'Inter, system-ui, Helvetica, Arial, sans-serif'
                    }}
                  >
                    Role
                  </Typography>
                  <TextField
                    fullWidth
                    value={formData.role}
                    disabled
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '10px',
                        backgroundColor: '#F8FAFC',
                        fontSize: '14px',
                        fontFamily: 'Inter, system-ui, Helvetica, Arial, sans-serif'
                      }
                    }}
                  />
                </Box>

                {/* Phone */}
                <Box>
                  <Typography
                    component="label"
                    sx={{
                      fontSize: '12px',
                      fontWeight: 500,
                      color: '#667085',
                      mb: 0.5,
                      display: 'block',
                      fontFamily: 'Inter, system-ui, Helvetica, Arial, sans-serif'
                    }}
                  >
                    Phone
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="Optional"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '10px',
                        backgroundColor: 'white',
                        fontSize: '14px',
                        fontFamily: 'Inter, system-ui, Helvetica, Arial, sans-serif'
                      }
                    }}
                  />
                </Box>

                {/* Timezone */}
                <Box>
                  <Typography
                    component="label"
                    sx={{
                      fontSize: '12px',
                      fontWeight: 500,
                      color: '#667085',
                      mb: 0.5,
                      display: 'block',
                      fontFamily: 'Inter, system-ui, Helvetica, Arial, sans-serif'
                    }}
                  >
                    Timezone
                  </Typography>
                  <Select
                    fullWidth
                    value={formData.timezone}
                    onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                    sx={{
                      borderRadius: '10px',
                      fontSize: '14px',
                      fontFamily: 'Inter, system-ui, Helvetica, Arial, sans-serif'
                    }}
                  >
                    <MenuItem value="Europe/Bucharest">Europe/Bucharest</MenuItem>
                    <MenuItem value="America/New_York">America/New York</MenuItem>
                    <MenuItem value="America/Los_Angeles">America/Los Angeles</MenuItem>
                    <MenuItem value="Europe/London">Europe/London</MenuItem>
                    <MenuItem value="Asia/Tokyo">Asia/Tokyo</MenuItem>
                  </Select>
                </Box>
              </Box>

              {/* Action Buttons */}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
                <Button
                  variant="outlined"
                  sx={{
                    color: '#2563EB',
                    borderColor: '#E6E8EE',
                    textTransform: 'none',
                    borderRadius: '10px',
                    px: 3,
                    fontSize: '14px',
                    fontFamily: 'Inter, system-ui, Helvetica, Arial, sans-serif',
                    '&:hover': {
                      borderColor: '#2563EB',
                      backgroundColor: 'rgba(37, 99, 235, 0.04)'
                    }
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: '#2563EB',
                    color: 'white',
                    textTransform: 'none',
                    borderRadius: '10px',
                    px: 3,
                    fontSize: '14px',
                    fontFamily: 'Inter, system-ui, Helvetica, Arial, sans-serif',
                    '&:hover': {
                      backgroundColor: '#1D4ED8'
                    }
                  }}
                >
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
                  fontSize: '16px',
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
                  Maria Brown
                </Typography>
              </Box>

              {/* Buttons */}
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <Button
                  variant="outlined"
                  fullWidth
                  sx={{
                    color: '#2563EB',
                    borderColor: '#E6E8EE',
                    textTransform: 'none',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontFamily: 'Inter, system-ui, Helvetica, Arial, sans-serif',
                    '&:hover': {
                      borderColor: '#2563EB',
                      backgroundColor: 'rgba(37, 99, 235, 0.04)'
                    }
                  }}
                >
                  Draw signature
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  sx={{
                    color: '#2563EB',
                    borderColor: '#E6E8EE',
                    textTransform: 'none',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontFamily: 'Inter, system-ui, Helvetica, Arial, sans-serif',
                    '&:hover': {
                      borderColor: '#2563EB',
                      backgroundColor: 'rgba(37, 99, 235, 0.04)'
                    }
                  }}
                >
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
                          color: '#2563EB'
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                          backgroundColor: '#2563EB'
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
                backgroundColor: 'white'
              }}
            >
              <Typography
                sx={{
                  fontSize: '16px',
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
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{
                      color: '#2563EB',
                      borderColor: '#E6E8EE',
                      textTransform: 'none',
                      borderRadius: '10px',
                      fontSize: '14px',
                      fontFamily: 'Inter, system-ui, Helvetica, Arial, sans-serif',
                      '&:hover': {
                        borderColor: '#2563EB',
                        backgroundColor: 'rgba(37, 99, 235, 0.04)'
                      }
                    }}
                  >
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
                      color: '#2563EB',
                      textTransform: 'none',
                      fontSize: '14px',
                      fontFamily: 'Inter, system-ui, Helvetica, Arial, sans-serif',
                      '&:hover': {
                        backgroundColor: 'rgba(37, 99, 235, 0.04)'
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
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{
                      color: '#2563EB',
                      borderColor: '#E6E8EE',
                      textTransform: 'none',
                      borderRadius: '10px',
                      fontSize: '14px',
                      fontFamily: 'Inter, system-ui, Helvetica, Arial, sans-serif',
                      '&:hover': {
                        borderColor: '#2563EB',
                        backgroundColor: 'rgba(37, 99, 235, 0.04)'
                      }
                    }}
                  >
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
