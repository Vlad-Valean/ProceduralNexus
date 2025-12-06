import React from "react";
import { Paper, Box, Typography, Button } from "@mui/material";
import { keyframes } from "@mui/system";

const orbitSpin = keyframes`
  0%   { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const OrganizationStats: React.FC = () => {
  return (
    <Paper
      sx={{
        p: { xs: 3, sm: 4 },
        borderRadius: 4,
        background: "#fff",
        minHeight: 630,
        boxShadow: "0 2px 16px #bfcbe6",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
      }}
    >
      {/* Title */}
         <Box sx={{ textAlign: "center", mt: 8, mb: 2.5 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: "#2b2b35",
            fontSize: { xs: "1.7rem", sm: "2rem" },
          }}
        >
          Your Organization
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{ color: "#4b4c5a", mt: 1, fontSize: "1.1rem", ml: 18 }}
        >
          in numbers
        </Typography>
      </Box>

      {/* Circles container */}
      <Box
        sx={{
          position: "relative",
          width: { xs: 260, sm: 340, md: 380 },
          height: { xs: 260, sm: 340, md: 380 },
             mb: 2.5,
        }}
      >
                {/* Button under MEMBERS circle, not lower than USERS circle */}
                <Box
                  sx={{
                    position: "absolute",
                    right: -10,
                    top: { xs: 245, sm: 285, md: 300 }, // just below the MEMBERS circle, above USERS circle
                    width: { xs: 160, sm: 200, md: 220 },
                    height: 40,
                    display: 'flex',
                    justifyContent: 'center',
                    pointerEvents: 'none',
                  }}
                >
                  <Button
                    variant="contained"
                    sx={{
                      textTransform: "none",
                      borderRadius: 3,
                      px: 2,
                      py: 0.5,
                      fontSize: "0.95rem",
                      minWidth: 120,
                      bgcolor: "#6f7688",
                      boxShadow: "none",
                      pointerEvents: 'auto',
                      "&:hover": {
                        bgcolor: "#3D3C42",
                        boxShadow: "none",
                      },
                      "&:focus": {
                        outline: "none",
                        boxShadow: "none",
                      },
                      "&:focus-visible": {
                        outline: "none",
                        boxShadow: "none",
                      },
                    }}
                  >
                    Check new applications
                  </Button>
                </Box>
        {/* Big circle – Members */}
        <Box
          sx={{
            position: "absolute",
            right: 0,
            top: { xs: 80, sm: 50 },
            width: { xs: 160, sm: 200, md: 220 },
            height: { xs: 160, sm: 200, md: 220 },
          }}
        >
          {/* Orbit line */}
          <Box
            sx={{
              position: "absolute",
              inset: { xs: -10, sm: -12 },
              borderRadius: "50%",
              border: "3px solid #67728A",
              borderTopColor: "transparent",
              borderLeftColor: "transparent",
              animation: `${orbitSpin} 18s linear infinite`,
            }}
          />
          {/* Static outline */}
          <Box
            sx={{
              position: "absolute",
              inset: { xs: -4, sm: -6 },
            }}
          />
          {/* Filled circle */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              bgcolor: "#67728A",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              textAlign: "center",
            }}
          >
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: { xs: "1.7rem", sm: "2rem" },
              }}
            >
              2000
            </Typography>
            <Typography
              sx={{
                fontWeight: 500,
                letterSpacing: 1,
                fontSize: { xs: "0.9rem", sm: "1rem" },
              }}
            >
              MEMBERS
            </Typography>
          </Box>
        </Box>

        {/* Top-left circle – HR */}
        <Box
          sx={{
            position: "absolute",
            left: { xs: 20, sm: 30, md: 40 },
            top: { xs: 40, sm: 50, md: 20 },
            width: { xs: 120, sm: 140, md: 150 },
            height: { xs: 120, sm: 140, md: 150 },
          }}
        >
          <Box
            sx={{
              position: "absolute",
              inset: { xs: -8, sm: -10 },
              borderRadius: "50%",
              border: "3px solid #A2ACC0",
              borderRightColor: "transparent",
              borderBottomColor: "transparent",
              animation: `${orbitSpin} 14s linear infinite`,
            }}
          />
          <Box
            sx={{
              position: "absolute",
              inset: { xs: -3, sm: -4 },
            }}
          />
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              bgcolor: "#A2ACC0",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              textAlign: "center",
            }}
          >
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: { xs: "1.4rem", sm: "1.6rem" },
              }}
            >
              250
            </Typography>
            <Typography sx={{ fontWeight: 500, fontSize: "0.9rem" }}>
              HR
            </Typography>
          </Box>
        </Box>

        {/* Bottom-left circle – Users */}
        <Box
          sx={{
            position: "absolute",
            left: -15,
            bottom: { xs: -30, sm: -40, md: 10 }, // moved lower for Figma match
            width: { xs: 150, sm: 170, md: 180 },
            height: { xs: 150, sm: 170, md: 180 },
          }}
        >
          <Box
            sx={{
              position: "absolute",
              inset: { xs: -8, sm: -10 },
              borderRadius: "50%",
              border: "3px solid #6B7485",
              borderTopColor: "transparent",
              borderRightColor: "transparent",
              animation: `${orbitSpin} 20s linear infinite`,
            }}
          />
          <Box
            sx={{
              position: "absolute",
              inset: { xs: -3, sm: -4 },
            }}
          />
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              bgcolor: "#6B7485",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              textAlign: "center",
            }}
          >
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: { xs: "1.5rem", sm: "1.7rem" },
              }}
            >
              1750
            </Typography>
            <Typography sx={{ fontWeight: 500, fontSize: "0.9rem" }}>
              USERS
            </Typography>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default OrganizationStats;
