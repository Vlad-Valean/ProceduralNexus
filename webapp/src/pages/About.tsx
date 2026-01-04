import React from "react";
import Navbar from "../components/Navbar";
import { Box, Container, Typography, Button, Paper, Grid } from '@mui/material';
import { Upload, Search, CheckCircle, Database, Server, Zap } from 'lucide-react';


export default function About() {
  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#F5F7FA' }}>
      <Navbar />

      <Container maxWidth="lg" sx={{ mt: 6, mb: 8 }}>
        {/* Page Title */}
        <Typography
          variant="h1"
          sx={{
            fontSize: '32px',
            lineHeight: '40px',
            fontWeight: 600,
            color: '#111827',
            mb: 2,
            fontFamily: 'Inter, system-ui, Helvetica, Arial, sans-serif'
          }}
        >
          About ProceduralNexus
        </Typography>
        <Typography
          sx={{
            fontSize: '14px',
            lineHeight: '20px',
            color: '#667085',
            mb: 6,
            maxWidth: '800px',
            fontFamily: 'Inter, system-ui, Helvetica, Arial, sans-serif'
          }}
        >
          ProceduralNexus is a comprehensive document management platform designed to streamline your workflow from upload to signature. 
          We combine powerful automation, intelligent analysis, and secure e-signature capabilities to help teams work more efficiently.
        </Typography>

        {/* Our Mission */}
        <Paper
          sx={{
            p: 4,
            mb: 4,
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
            Our mission
          </Typography>
          <Typography
            sx={{
              fontSize: '14px',
              lineHeight: '20px',
              color: '#667085',
              fontFamily: 'Inter, system-ui, Helvetica, Arial, sans-serif'
            }}
          >
            We believe document management should be effortless. Our mission is to eliminate the friction in document workflows 
            by providing intelligent automation, real-time insights, and seamless collaboration tools. Whether you're managing 
            contracts, compliance documents, or employee onboarding materials, ProceduralNexus adapts to your needs.
          </Typography>
        </Paper>

        {/* How it works */}
        <Paper
          sx={{
            p: 4,
            mb: 4,
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
            How it works
          </Typography>
          <Grid container spacing={3}>
            {[
              {
                icon: Upload,
                title: 'Upload & Assign',
                description: 'Upload documents and assign them to team members with customizable workflows and due dates.'
              },
              {
                icon: Search,
                title: 'Analyze',
                description: 'Our AI engine automatically extracts key information and categorizes documents for easy retrieval.'
              },
              {
                icon: CheckCircle,
                title: 'Review & Sign',
                description: 'Review, approve, and digitally sign documents with legally-binding e-signatures and full audit trails.'
              }
            ].map((step, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Box>
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
                    <step.icon size={24} color="#2563EB" />
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
                    {step.title}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '14px',
                      color: '#667085',
                      fontFamily: 'Inter, system-ui, Helvetica, Arial, sans-serif'
                    }}
                  >
                    {step.description}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Paper>

        {/* Platform Architecture */}
        <Paper
          sx={{
            p: 4,
            mb: 4,
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
            Platform architecture
          </Typography>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              flexWrap: 'wrap',
              justifyContent: 'center'
            }}
          >
            <Box
              sx={{
                px: 3,
                py: 2,
                borderRadius: '999px',
                backgroundColor: 'rgba(37, 99, 235, 0.1)',
                border: '1px solid rgba(37, 99, 235, 0.2)',
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              <Box sx={{ fontSize: '14px', fontWeight: 500, color: '#2563EB', fontFamily: 'Inter, system-ui, Helvetica, Arial, sans-serif' }}>
                Webapp (React/Vite)
              </Box>
            </Box>
            <Typography sx={{ fontSize: '20px', color: '#98A2B3' }}>→</Typography>
            <Box
              sx={{
                px: 3,
                py: 2,
                borderRadius: '999px',
                backgroundColor: 'rgba(37, 99, 235, 0.1)',
                border: '1px solid rgba(37, 99, 235, 0.2)',
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              <Box sx={{ fontSize: '14px', fontWeight: 500, color: '#2563EB', fontFamily: 'Inter, system-ui, Helvetica, Arial, sans-serif' }}>
                API Service (Spring Boot)
              </Box>
            </Box>
            <Typography sx={{ fontSize: '20px', color: '#98A2B3' }}>→</Typography>
            <Box
              sx={{
                px: 3,
                py: 2,
                borderRadius: '999px',
                backgroundColor: 'rgba(37, 99, 235, 0.1)',
                border: '1px solid rgba(37, 99, 235, 0.2)',
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              <Box sx={{ fontSize: '14px', fontWeight: 500, color: '#2563EB', fontFamily: 'Inter, system-ui, Helvetica, Arial, sans-serif' }}>
                Document Analysis Service
              </Box>
            </Box>
            <Typography sx={{ fontSize: '20px', color: '#98A2B3' }}>→</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box
                sx={{
                  px: 3,
                  py: 2,
                  borderRadius: '999px',
                  backgroundColor: 'rgba(18, 183, 106, 0.1)',
                  border: '1px solid rgba(18, 183, 106, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                <Database size={16} color="#12B76A" />
                <Box sx={{ fontSize: '14px', fontWeight: 500, color: '#12B76A', fontFamily: 'Inter, system-ui, Helvetica, Arial, sans-serif' }}>
                  PostgreSQL
                </Box>
              </Box>
              <Box
                sx={{
                  px: 3,
                  py: 2,
                  borderRadius: '999px',
                  backgroundColor: 'rgba(247, 144, 9, 0.1)',
                  border: '1px solid rgba(247, 144, 9, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                <Zap size={16} color="#F79009" />
                <Box sx={{ fontSize: '14px', fontWeight: 500, color: '#F79009', fontFamily: 'Inter, system-ui, Helvetica, Arial, sans-serif' }}>
                  Redis
                </Box>
              </Box>
            </Box>
          </Box>
        </Paper>

        {/* Security & Privacy */}
        <Paper
          sx={{
            p: 4,
            mb: 4,
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
            Security & privacy
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {[
              'Access controls and authenticated sessions',
              'Encrypted transport (HTTPS/TLS)',
              'Audit-friendly document status tracking',
              'User-controlled signature management'
            ].map((item, index) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <CheckCircle size={20} color="#12B76A" style={{ flexShrink: 0, marginTop: '2px' }} />
                <Typography
                  sx={{
                    fontSize: '14px',
                    color: '#667085',
                    fontFamily: 'Inter, system-ui, Helvetica, Arial, sans-serif'
                  }}
                >
                  {item}
                </Typography>
              </Box>
            ))}
          </Box>
        </Paper>

        {/* CTA */}
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
              mb: 3,
              color: '#111827',
              fontFamily: 'Inter, system-ui, Helvetica, Arial, sans-serif'
            }}
          >
            Start managing documents today
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
          mt: 4,
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

export default About;
