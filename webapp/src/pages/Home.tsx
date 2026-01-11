import React, { useRef } from "react";
import Navbar from "../components/Navbar";
import { Box, Container, Typography, Button, Paper } from '@mui/material';
import { Description, TrendingUpSharp, DrawRounded } from '@mui/icons-material';
import { Link } from "react-router-dom";

const Home: React.FC = () => {
  const featuresRef = useRef<HTMLDivElement>(null);
  const handleScrollToFeatures = () => {
    if (featuresRef.current) {
      featuresRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Box sx={{ minHeight: '100vh' }}>
      <Navbar />
      {/* Hero Section - Full viewport height, centered, single white container */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', px: 2, mt: 5, mb: 6 }}>
        <Paper
          sx={{
            width: '100%',
            maxWidth: '1056px',
            minHeight: { xs: 'auto', md: '70vh' },
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            p: { xs: 3, md: 6 },
            borderRadius: '18px',
            boxShadow: '0px 8px 32px rgba(16, 24, 40, 0.10)',
            backgroundColor: 'white',
            my: 0,
          }}
        >
          {/* Left Column - Text */}
          <Box
            sx={{
              flex: 1,
              minWidth: 0,
              maxWidth: { xs: '100%', md: '50%' },
              pr: { md: 4 },
              mb: { xs: 4, md: 0 },
              display: 'flex',
              flexDirection: 'column',
              alignItems: { xs: 'center', md: 'flex-start' },
              textAlign: { xs: 'center', md: 'left' }
            }}
          >
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '32px', md: '48px' },
                lineHeight: { xs: '40px', md: '56px' },
                fontWeight: 600,
                color: '#111827',
                mb: 3,
                fontFamily: 'Inter, system-ui, Helvetica, Arial, sans-serif',
                textAlign: { xs: 'center', md: 'left' },
                width: '100%'
              }}
            >
                  Streamline documents.<br />
                  Automate analysis.<br />
                  Sign faster.
            </Typography>
            <Typography
              sx={{
                fontSize: '14px',
                lineHeight: '20px',
                color: '#667085',
                mb: 4,
                fontFamily: 'Inter, system-ui, Helvetica, Arial, sans-serif',
                textAlign: { xs: 'center', md: 'left' },
                width: '100%'
              }}
            >
              ProceduralNexus helps you upload, manage, and track documents, extract insights with AI, and complete secure e‑signatures in one place.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: { xs: 'center', md: 'flex-start' }, width: '100%' }}>
              <Link to="/register" style={{ textDecoration: 'none' }}>
                <Button
              variant="contained"
              sx={{
                    backgroundColor: '#67728A',
                    color: '#FFFFFF',
                    textTransform: 'none',
                    borderRadius: '10px',
                    px: 4,
                    py: 1.5,
                    fontSize: '14px',
                    fontFamily: 'Inter, system-ui, Helvetica, Arial, sans-serif',
                    '&:hover': {
                    backgroundColor: '#3D3C42'
                    }
                  }}
            >
                  Get started
                </Button>
              </Link>
              <Button
                variant="outlined"
                onClick={handleScrollToFeatures}
                sx={{
                  color: '#67728A',
                  borderColor: '#E6E8EE',
                  textTransform: 'none',
                  borderRadius: '10px',
                  px: 3,
                  py: 1.5,
                  fontSize: '14px',
                  fontFamily: 'Inter, system-ui, Helvetica, Arial, sans-serif',
                  '&:hover': {
                    borderColor: '#67728A',
                    backgroundColor: 'rgba(103, 114, 138, 0.04)'
                  },
                  '&:focus': {
                    outline: 'none',
                    boxShadow: 'none'
                  },
                  '&:active': {
                    outline: 'none',
                    boxShadow: 'none'
                  }
                }}
              >
                View features
              </Button>
            </Box>
          </Box>

          {/* Right Column - Preview Card */}
          <Box
            sx={{
              flex: 1,
              minWidth: 0,
              maxWidth: { xs: '100%', md: '33.33%' },
              pl: { md: 4 },
              mb: { xs: 4, md: 0 },
              display: 'flex',
              flexDirection: 'column',
              alignItems: { xs: 'center', md: 'flex-start' }
            }}
          >
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
                  mb: 2,
                  color: '#111827',
                  fontFamily: 'Inter, system-ui, Helvetica, Arial, sans-serif'
                }}
              >
                Your documents in numbers
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-around', mb: 3 }}>
                {[
                  { label: 'PENDING', value: '3', color: '#2563EB' },
                  { label: 'IN REVIEW', value: '1', color: '#F79009' },
                  { label: 'COMPLETED', value: '8', color: '#12B76A' }
                ].map((stat) => (
                  <Box key={stat.label} sx={{ textAlign: 'center' }}>
                    <Box
                      sx={{
                        width: 80,
                        height: 80,
                        borderRadius: '50%',
                        border: `8px solid ${stat.color}`,
                        borderRightColor: '#EEF2F6',
                        borderBottomColor: '#EEF2F6',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 1,
                        position: 'relative'
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: '20px',
                          fontWeight: 600,
                          color: stat.color,
                          fontFamily: 'Inter, system-ui, Helvetica, Arial, sans-serif'
                        }}
                      >
                        {stat.value}
                      </Typography>
                    </Box>
                    <Typography
                      sx={{
                        fontSize: '12px',
                        fontWeight: 500,
                        color: '#667085',
                        textTransform: 'uppercase',
                        letterSpacing: '0.02em',
                        fontFamily: 'Inter, system-ui, Helvetica, Arial, sans-serif'
                      }}
                    >
                      {stat.label}
                    </Typography>
                  </Box>
                ))}
              </Box>
              <Box
                sx={{
                  borderTop: '1px solid #E6E8EE',
                  pt: 2,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <Typography sx={{ fontSize: '12px', color: '#667085', fontFamily: 'Inter, system-ui, Helvetica, Arial, sans-serif' }}>
                  5 documents awaiting signature
                </Typography>
              </Box>
            </Paper>
          </Box>
        </Paper>
      </Box>

      {/* Features Section - Single white container */}
      <Container maxWidth="lg" sx={{ mb: 8 }} ref={featuresRef}>
        <Paper
          sx={{
            p: { xs: 3, md: 6 },
            borderRadius: '18px',
            boxShadow: '0px 8px 32px rgba(16, 24, 40, 0.10)',
            backgroundColor: 'white',
            mb: 0,
          }}
        >
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '24px', md: '32px' },
              fontWeight: 700,
              color: '#111827',
              mb: 6,
              textAlign: 'center',
              fontFamily: 'Inter, system-ui, Helvetica, Arial, sans-serif',
              letterSpacing: '-0.01em'
            }}
          >
            Discover our features
          </Typography>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: 'stretch',
              justifyContent: 'center',
              gap: 4,
              width: '100%'
            }}
          >
            {[
              {
                icon: Description,
                title: 'Document Management',
                description: 'upload, assign, track'
              },
              {
                icon: TrendingUpSharp,
                title: 'AI Analysis',
                description: 'extract insights, automate workflows'
              },
              {
                icon: DrawRounded,
                title: 'E‑Signature',
                description: 'secure signing, audit trail'
              }
            ].map((feature, index) => (
              <Box
                key={index}
                sx={{
                  flex: 1,
                  minWidth: 0,
                  maxWidth: { xs: '100%', md: '33.33%' },
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  px: 2,
                  mb: { xs: 4, md: 0 }
                }}
              >
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    backgroundColor: 'rgba(37, 99, 235, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2
                  }}
                >
                  <feature.icon sx={{ fontSize: 24, color: "#2563EB" }} />
                </Box>
                <Typography
                  sx={{
                    fontSize: '16px',
                    fontWeight: 600,
                    mb: 1,
                    color: '#111827',
                    fontFamily: 'Inter, system-ui, Helvetica, Arial, sans-serif',
                    textAlign: 'center'
                  }}
                >
                  {feature.title}
                </Typography>
                <Typography
                  sx={{
                    fontSize: '14px',
                    color: '#667085',
                    fontFamily: 'Inter, system-ui, Helvetica, Arial, sans-serif',
                    textAlign: 'center'
                  }}
                >
                  {feature.description}
                </Typography>
              </Box>
            ))}
          </Box>
        </Paper>
      </Container>

      {/* CTA Section */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Paper
          sx={{
            p: 6,
            borderRadius: '12px',
            border: '1px solid #E6E8EE',
            boxShadow: '0px 8px 24px rgba(16, 24, 40, 0.08)',
            backgroundColor: 'white',
            textAlign: 'center'
          }}
        >
          <Typography
            sx={{
              fontSize: '26px',
              fontWeight: 600,
              mb: 2,
              color: '#111827',
              fontFamily: 'Inter, system-ui, Helvetica, Arial, sans-serif'
            }}
          >
            Ready to get started?
          </Typography>
          <Typography
            sx={{
              fontSize: '14px',
              color: '#667085',
              mb: 4,
              fontFamily: 'Inter, system-ui, Helvetica, Arial, sans-serif'
            }}
          >
            Create an account and start managing documents in minutes.
          </Typography>
          <Link to="/register" style={{ textDecoration: 'none' }}>
            <Button
              variant="contained"
              sx={{
                    backgroundColor: '#67728A',
                    color: '#FFFFFF',
                    textTransform: 'none',
                    borderRadius: '10px',
                    px: 4,
                    py: 1.5,
                    fontSize: '14px',
                    fontFamily: 'Inter, system-ui, Helvetica, Arial, sans-serif',
                    '&:hover': {
                    backgroundColor: '#3D3C42'
                    }
                  }}
            >
            Create an account
           </Button>
          </Link>
        </Paper>
      </Container>
    </Box>
  );
}

export default Home;
