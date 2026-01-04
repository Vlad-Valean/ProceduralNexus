import React from "react";
import Navbar from "../components/Navbar";
import { Box, Container, Typography, Button, Grid, Paper } from '@mui/material';
import { FileText, TrendingUp, Edit3 } from 'lucide-react';


export default function Home() {
  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#F5F7FA' }}>
      <Navbar />

      {/* Hero Section */}
      <Container maxWidth="lg" sx={{ mt: 8, mb: 8 }}>
        <Grid container spacing={4} alignItems="center">
          {/* Left Column - Text */}
          <Grid item xs={12} md={6}>
            <Typography
              variant="h1"
              sx={{
                fontSize: '32px',
                lineHeight: '40px',
                fontWeight: 600,
                color: '#111827',
                mb: 3,
                fontFamily: 'Inter, system-ui, Helvetica, Arial, sans-serif'
              }}
            >
              Streamline documents. Automate analysis. Sign faster.
            </Typography>
            <Typography
              sx={{
                fontSize: '14px',
                lineHeight: '20px',
                color: '#667085',
                mb: 4,
                fontFamily: 'Inter, system-ui, Helvetica, Arial, sans-serif'
              }}
            >
              ProceduralNexus helps you upload, manage, and track documents, extract insights with AI, and complete secure e‑signatures in one place.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Link to="/register" style={{ textDecoration: 'none' }}>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: '#2563EB',
                    color: 'white',
                    textTransform: 'none',
                    borderRadius: '10px',
                    px: 3,
                    py: 1.5,
                    fontSize: '14px',
                    fontFamily: 'Inter, system-ui, Helvetica, Arial, sans-serif',
                    '&:hover': {
                      backgroundColor: '#1D4ED8'
                    }
                  }}
                >
                  Get started
                </Button>
              </Link>
              <Button
                variant="outlined"
                sx={{
                  color: '#2563EB',
                  borderColor: '#E6E8EE',
                  textTransform: 'none',
                  borderRadius: '10px',
                  px: 3,
                  py: 1.5,
                  fontSize: '14px',
                  fontFamily: 'Inter, system-ui, Helvetica, Arial, sans-serif',
                  '&:hover': {
                    borderColor: '#2563EB',
                    backgroundColor: 'rgba(37, 99, 235, 0.04)'
                  }
                }}
              >
                View features
              </Button>
            </Box>
          </Grid>

          {/* Right Column - Preview Card */}
          <Grid item xs={12} md={6}>
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
          </Grid>
        </Grid>
      </Container>

      {/* Feature Cards */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Grid container spacing={3}>
          {[
            {
              icon: FileText,
              title: 'Document Management',
              description: 'upload, assign, track'
            },
            {
              icon: TrendingUp,
              title: 'AI Analysis',
              description: 'extract insights, automate workflows'
            },
            {
              icon: Edit3,
              title: 'E‑Signature',
              description: 'secure signing, audit trail'
            }
          ].map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Paper
                sx={{
                  p: 3,
                  borderRadius: '12px',
                  border: '1px solid #E6E8EE',
                  boxShadow: '0px 8px 24px rgba(16, 24, 40, 0.08)',
                  backgroundColor: 'white',
                  height: '100%'
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
                  <feature.icon size={24} color="#2563EB" />
                </Box>
                <Typography
                  sx={{
                    fontSize: '16px',
                    fontWeight: 600,
                    mb: 1,
                    color: '#111827',
                    fontFamily: 'Inter, system-ui, Helvetica, Arial, sans-serif'
                  }}
                >
                  {feature.title}
                </Typography>
                <Typography
                  sx={{
                    fontSize: '14px',
                    color: '#667085',
                    fontFamily: 'Inter, system-ui, Helvetica, Arial, sans-serif'
                  }}
                >
                  {feature.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
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
              fontSize: '20px',
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
              mb: 3,
              fontFamily: 'Inter, system-ui, Helvetica, Arial, sans-serif'
            }}
          >
            Create an account and start managing documents in minutes.
          </Typography>
          <Link to="/register" style={{ textDecoration: 'none' }}>
            <Button
              variant="contained"
              sx={{
                backgroundColor: '#2563EB',
                color: 'white',
                textTransform: 'none',
                borderRadius: '10px',
                px: 4,
                py: 1.5,
                fontSize: '14px',
                fontFamily: 'Inter, system-ui, Helvetica, Arial, sans-serif',
                '&:hover': {
                  backgroundColor: '#1D4ED8'
                }
              }}
            >
              Create account
            </Button>
          </Link>
        </Paper>
      </Container>

      {/* Footer */}
      <Box
        sx={{
          borderTop: '1px solid #E6E8EE',
          py: 3,
          backgroundColor: 'white'
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', gap: 4, justifyContent: 'center' }}>
            <Typography sx={{ fontSize: '12px', color: '#98A2B3', fontFamily: 'Inter, system-ui, Helvetica, Arial, sans-serif' }}>
              Privacy
            </Typography>
            <Typography sx={{ fontSize: '12px', color: '#98A2B3', fontFamily: 'Inter, system-ui, Helvetica, Arial, sans-serif' }}>
              Terms
            </Typography>
            <Typography sx={{ fontSize: '12px', color: '#98A2B3', fontFamily: 'Inter, system-ui, Helvetica, Arial, sans-serif' }}>
              Contact
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}

export default Home;
