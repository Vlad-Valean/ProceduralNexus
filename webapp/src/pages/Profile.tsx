import React, { useState, useEffect } from 'react';
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

const BASE_URL = "http://localhost:8080";

interface ProfileResponse {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  roles: string[];
  organizationId: number | null;
}

interface OrganizationResponse {
  id: number;
  name: string;
}

const fetchWithAuth = async <T,>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  const token = localStorage.getItem('accessToken');
  
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API Error: ${response.status}`);
  }

  return response.json();
};



const Profile: React.FC = () => {
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [organization, setOrganization] = useState<OrganizationResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
  });

  const [cvData, setCvData] = useState({
    documentName: '',
    file: null as File | null
  });

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) {
        setError('User not logged in. Please log in again.');
        setLoading(false);
        return;
      }

      try {
        const profileData = await fetchWithAuth<ProfileResponse>(`/profiles/${userId}`);
        setProfile(profileData);
        setFormData({
          firstName: profileData.firstname || '',
          lastName: profileData.lastname || '',
        });

        if (profileData.organizationId) {
          try {
            const orgData = await fetchWithAuth<OrganizationResponse>(
              `/organizations/${profileData.organizationId}`
            );
            setOrganization(orgData);
          } catch (orgErr) {
            console.error('Failed to fetch organization:', orgErr);
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const handleSave = async () => {
    if (!userId || !profile) return;

    setSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const updated = await fetchWithAuth<ProfileResponse>(`/profiles/${userId}`, {
        method: 'PATCH',
        body: JSON.stringify({
          firstname: formData.firstName,
          lastname: formData.lastName,
        }),
      });
      
      setProfile(updated);
      setSuccessMessage('Profile updated successfully!');
      
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        firstName: profile.firstname || '',
        lastName: profile.lastname || '',
      });
    }
    setError(null);
    setSuccessMessage(null);
  };

  const getRoleDisplay = (roles: string[] | undefined): string => {
    if (!roles || roles.length === 0) return 'Standard user';
    if (roles.includes('ADMIN')) return 'Administrator';
    if (roles.includes('HR')) return 'HR Manager';
    return 'Standard user';
  };

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
    outline: 'none !important',
    '&:hover': {
      backgroundColor: '#5a6276',
      outline: 'none !important',
      boxShadow: 'none !important'
    },
    '&:focus': {
      outline: 'none !important',
      boxShadow: 'none !important'
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setCvData({ ...cvData, file });
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh' }}>
        <Navbar />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <CircularProgress sx={{ color: '#67728A' }} />
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh' }}>
      <Navbar />

      <Container maxWidth={false} sx={{ mt: 4, mb: 8, px: { xs: 1, sm: 4, md: 8 } }}>
        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Success Alert */}
        {successMessage && (
          <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccessMessage(null)}>
            {successMessage}
          </Alert>
        )}

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
                  fontSize: '24px',
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
                  <Typography component="label" sx={{ ...labelSx, textAlign: 'left' }}>
                    First name
                  </Typography>
                  <TextField
                    fullWidth
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    autoComplete="off"
                    sx={{ ...textFieldSx, '& input': { textAlign: 'left' } }}
                  />
                </Box>

                <Box>
                  <Typography component="label" sx={{ ...labelSx, textAlign: 'left' }}>
                    Last name
                  </Typography>
                  <TextField
                    fullWidth
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    autoComplete="off"
                    sx={{ ...textFieldSx, '& input': { textAlign: 'left' } }}
                  />
                </Box>

                <Box>
                  <Typography component="label" sx={{ ...labelSx, textAlign: 'left' }}>
                    Email
                  </Typography>
                  <TextField
                    fullWidth
                    value={profile?.email || ''}
                    disabled
                    sx={{ ...disabledTextFieldSx, '& input': { textAlign: 'left' } }}
                  />
                </Box>

                <Box>
                  <Typography component="label" sx={{ ...labelSx, textAlign: 'left' }}>
                    Organization
                  </Typography>
                  <TextField
                    fullWidth
                    value={organization?.name || 'No organization'}
                    disabled
                    sx={{ ...disabledTextFieldSx, '& input': { textAlign: 'left' } }}
                  />
                </Box>

                <Box>
                  <Typography component="label" sx={{ ...labelSx, textAlign: 'left' }}>
                    Role
                  </Typography>
                  <TextField
                    fullWidth
                    value={getRoleDisplay(profile?.roles)}
                    disabled
                    sx={{ ...disabledTextFieldSx, '& input': { textAlign: 'left' } }}
                  />
                </Box>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
                <Button 
                  variant="outlined" 
                  sx={{ ...outlinedButtonSx, px: 3 }}
                  onClick={handleCancel}
                  disabled={saving}
                >
                  Cancel
                </Button>
                <Button 
                  variant="contained" 
                  sx={primaryButtonSx}
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save changes'}
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
                  fontSize: '22px',
                  fontWeight: 700,
                  mb: 3,
                  mt: 1,
                  color: '#111827',
                  fontFamily: 'Inter, system-ui, Helvetica, Arial, sans-serif',
                  textAlign: 'center',
                  letterSpacing: '0.5px'
                }}
              >
                Upload your Resume
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box>
                  <Typography component="label" sx={{ ...labelSx, textAlign: 'left' }}>
                    Document name
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="e.g. MariaBrownCV.pdf"
                    value={cvData.documentName}
                    onChange={(e) => setCvData({ ...cvData, documentName: e.target.value })}
                    autoComplete="off"
                    sx={{ ...textFieldSx, mt: 1.5, '& input': { textAlign: 'left' } }}
                  />
                </Box>

                <Box>
                  <Typography component="label" sx={{ ...labelSx, textAlign: 'left' }}>
                    Upload resume
                  </Typography>
                  <Box
                    sx={{
                      border: '1px dashed #E6E8EE',
                      borderRadius: '10px',
                      p: 3,
                      mt: 1.5,
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
                        mb: 0.5,
                        textAlign: 'center'
                      }}
                    >
                      {cvData.file ? cvData.file.name : 'Click to upload'}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: '12px',
                        color: '#98A2B3',
                        fontFamily: 'Inter, system-ui, Helvetica, Arial, sans-serif',
                        textAlign: 'center'
                      }}
                    >
                      PDF, DOC, DOCX (max 5MB)
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                <Button variant="outlined" sx={{ ...outlinedButtonSx, px: 3 }}>
                  Cancel
                </Button>
                <Button variant="contained" sx={primaryButtonSx}>
                  Save changes
                </Button>
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
                  mb: 5.1,
                  mt: 1,
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
                    fontWeight: 400,
                    color: '#000000',
                    fontFamily: 'Inter, system-ui, Helvetica, Arial, sans-serif'
                  }}
                >
                  Change your password
                </Typography>
                <Button variant="contained" sx={primaryButtonSx}>
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