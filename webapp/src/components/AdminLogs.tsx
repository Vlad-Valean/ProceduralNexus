import React from "react";
import { Paper, Button, Box, Typography } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

interface AdminLogsProps {
  onBack: () => void;
  logsTarget?: string | null;
}

const AdminLogs: React.FC<AdminLogsProps> = ({ onBack, logsTarget }) => (
  <Paper
    sx={{
      px: { xs: 2.5, sm: 2.5 },
      pt: { xs: 2.5, sm: 2.5 },
      pb: { xs: 1.2, sm: 1.2 },
      borderRadius: 4,
      background: "#fff",
      boxShadow: "0 2px 16px #bfcbe6",
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      justifyContent: "flex-start",
      width: "100%",
      minWidth: 0,
      boxSizing: "border-box",
      height: "100%",
      minHeight: 630,
    }}
  >
    <Button
      onClick={onBack}
      startIcon={<ArrowBackIosNewIcon sx={{ fontSize: 14 }} />}
      sx={{
        textTransform: "none",
        color: "#67728A",
        fontWeight: 500,
        fontSize: "0.9rem",
        px: 0,
        mb: 2,
        "&:hover": { backgroundColor: "transparent", color: "#3D3C42" },
        "&:focus": { outline: "none" },
        justifyContent: "flex-start",
      }}
    >
      Back
    </Button>
    <Box
      sx={{
        width: "100%",
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Typography
        sx={{
          color: "#b5b7c0",
          fontSize: "1.2rem",
          textAlign: "center",
        }}
      >
        {logsTarget === undefined || logsTarget === null
          ? "Showing all server logs"
          : `Showing logs for\n${logsTarget}`}
      </Typography>
    </Box>
  </Paper>
);

export default AdminLogs;
