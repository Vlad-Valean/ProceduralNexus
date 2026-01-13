import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button
} from '@mui/material';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';

const Profile: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: 'Maria',
    lastName: 'Brown',
    email: 'maria.brown@example.com',
    organization: 'Acme Corp',
    role: 'Standard user'
  });

  const [cvData, setCvData] = useState({
    documentName: '',
    file: null as File | null
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
    textTransform: 'none' as const,
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
    textTransform: 'none' as const,
    borderRadius: '10px',
    px: 3,
    fontSize: '14px',
    fontFamily: 'Inter, system-ui, Helvetica, Arial, sans-serif',
    boxShadow: 'none !important',
    '&:hover': {
      backgroundColor: '#5a6276'
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setCvData({ ...cvData, file });
  };

  return (
    <Box sx={{ minHeight: '100vh' }}>
      <Navbar />

      <Container maxWidth={false} sx={{ mt: 4, mb: 8, px: { xs: 1, sm: 4, md: 8 } }}>
        <Box sx={{ display: 'flex', gap: 4, alignItems: 'flex-start' }}>
          {/* Left Column - Profile Information */}
          <Box sx={{ flex: 2, minWidth: 0 }}>
            <Paper
              sx={{
                p: 4,
                borderRadius: '12px',
                border: '1px solid #E6E8EE',
                boxShadow: '0px 8px 24px rgba(16, 24, 40, 0.08)',
                backgroundColor: 'white',
                minHeight: 520,
                display: 'flex',
                flexDirection: 'column'
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

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, flex: 1 }}>
                <Box>
                  <Typography component="label" sx={labelSx}>
                    First name
                  </Typography>
                  <TextField
                    fullWidth
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    autoComplete="off"
                    sx={textFieldSx}
                  />
                </Box>

                <Box>
                  <Typography component="label" sx={labelSx}>
                    Last name
                  </Typography>
                  <TextField
                    fullWidth
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    autoComplete="off"
                    sx={textFieldSx}
                  />
                </Box>

                <Box>
                  <Typography component="label" sx={labelSx}>
                    Email
                  </Typography>
                  <TextField
                    fullWidth
                    value={formData.email}
                    disabled
                    sx={disabledTextFieldSx}
                  />
                </Box>

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
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
                <Button variant="outlined" sx={{ ...outlinedButtonSx, px: 3 }}>
                  Cancel
                </Button>
                <Button variant="contained" sx={primaryButtonSx}>
                  Save changes
                </Button>
              </Box>
            </Paper>
          </Box>

          {/* Right Column */}
          <Box sx={{ width: '420px', minWidth: '340px', display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* CV Upload Card */}
            <Paper
              sx={{
                p: 3,
                borderRadius: '12px',
                border: '1px solid #E6E8EE',
                boxShadow: '0px 8px 24px rgba(16, 24, 40, 0.08)',
                backgroundColor: 'white',
                flex: 1
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
                CV / Resume
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box>
                  <Typography component="label" sx={labelSx}>
                    Document name
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="e.g. MariaBrownCV.pdf"
                    value={cvData.documentName}
                    onChange={(e) => setCvData({ ...cvData, documentName: e.target.value })}
                    autoComplete="off"
                    sx={textFieldSx}
                  />
                </Box>

                <Box>
                  <Typography component="label" sx={labelSx}>
                    Upload CV
                  </Typography>
                  <Box
                    sx={{
                      border: '1px dashed #E6E8EE',
                      borderRadius: '10px',
                      p: 3,
                      textAlign: 'center',
                      backgroundColor: '#FAFAFA',
                      cursor: 'pointer',
                      '&:hover': {
                        borderColor: '#67728A',
                        backgroundColor: '#F5F5F5'
                      }
                    }}
                    onClick={() => document.getElementById('cv-upload-input')?.click()}
                  >
                    <input
                      id="cv-upload-input"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      style={{ display: 'none' }}
                    />
                    <CloudUploadOutlinedIcon
                      sx={{ fontSize: 40, color: '#67728A', mb: 1 }}
                    />
                    <Typography
                      sx={{
                        fontSize: '14px',
                        color: '#111827',
                        fontFamily: 'Inter, system-ui, Helvetica, Arial, sans-serif',
                        mb: 0.5
                      }}
                    >
                      {cvData.file ? cvData.file.name : 'Click to upload'}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: '12px',
                        color: '#98A2B3',
                        fontFamily: 'Inter, system-ui, Helvetica, Arial, sans-serif'
                      }}
                    >
                      PDF, DOC, DOCX (max 5MB)
                    </Typography>
                  </Box>
                </Box>
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
                  fontSize: '20px',
                  fontWeight: 600,
                  mb: 3,
                  color: '#111827',
                  fontFamily: 'Inter, system-ui, Helvetica, Arial, sans-serif'
                }}
              >
                Security
              </Typography>

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
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
            </Paper>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Profile;