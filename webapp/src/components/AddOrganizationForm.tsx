import React, { useState } from "react";
import { Paper, Typography, TextField, Button, Box, Snackbar, Alert } from "@mui/material";
import { createOrganization } from "../utils/admin";

type Props = {
  onCreated: () => void;
};

const AddOrganizationForm: React.FC<Props> = ({ onCreated }) => {
  const [orgName, setOrgName] = useState("");
  const [email, setEmail] = useState("");

  const [emailError, setEmailError] = useState("");
  const [orgNameError, setOrgNameError] = useState("");

  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMsg, setSnackMsg] = useState("");
  const [snackSeverity, setSnackSeverity] = useState<"success" | "error">("success");

  const openSnack = (msg: string, severity: "success" | "error") => {
    setSnackMsg(msg);
    setSnackSeverity(severity);
    setSnackOpen(true);
  };

  const validateEmail = (value: string) =>
    /^[\w-.]+@[\w-]+\.[a-zA-Z]{2,}$/.test(value);

  const handleAddOrganization = async () => {
    let valid = true;

    if (!orgName.trim()) {
      setOrgNameError("Required field*");
      valid = false;
    } else {
      setOrgNameError("");
    }

    // Owner email: îl facem OPTIONAL (dar dacă e completat, îl validăm)
    if (email.trim().length > 0 && !validateEmail(email.trim())) {
      setEmailError("Invalid email address*");
      valid = false;
    } else {
      setEmailError("");
    }

    if (!valid) return;

    const token = localStorage.getItem("token") || "";
    if (!token) {
      openSnack("Not authenticated (missing token).", "error");
      return;
    }

    try {
      await createOrganization(token, {
        name: orgName.trim(),
        ownerEmail: email.trim() || undefined,
      });

      setOrgName("");
      setEmail("");
      setEmailError("");
      setOrgNameError("");

      openSnack("Organization was successfully added.", "success");
      onCreated(); // refresh instant lista
    } catch (e: unknown) {
      openSnack(e instanceof Error ? e.message : "Failed to create organization.", "error");
    }
  };

  return (
    <Paper
      component="form"
      autoComplete="off"
      onSubmit={(e) => {
        e.preventDefault();
        handleAddOrganization();
      }}
      sx={{
        p: { xs: 2, sm: 2.5 },
        borderRadius: 3,
        background: "#fff",
        boxShadow: "0 2px 16px #bfcbe6",
        display: "flex",
        flexDirection: "column",
        width: "100%",
        minWidth: 0,
        boxSizing: "border-box",
        mb: 0,
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, textAlign: "left" }}>
        Add new organization
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.25 }}>
        <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", mb: 0.75 }}>
          <Typography variant="body2" sx={{ fontWeight: 500, color: "#4b5563", textAlign: "left", flex: 1 }}>
            Organization name
          </Typography>
          {orgNameError && (
            <Typography variant="caption" color="error" sx={{ minWidth: 0, textAlign: "right", flex: 1 }}>
              {orgNameError}
            </Typography>
          )}
        </Box>

        <TextField
          fullWidth
          type="text"
          placeholder="Organization name"
          size="medium"
          value={orgName}
          onChange={(e) => setOrgName(e.target.value)}
          error={!!orgNameError}
          autoComplete="off"
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 3,
              bgcolor: "#f4f6fb",
              height: 42,
              "& fieldset": { borderColor: "#dde3f0" },
              "&:hover fieldset": { borderColor: "#cfd6e6" },
              "&.Mui-focused fieldset": { borderColor: "#a5b1c8" },
            },
            "& input:-webkit-autofill, & input:-webkit-autofill:focus": {
              WebkitBoxShadow: "0 0 0 1000px #f4f6fb inset",
              WebkitTextFillColor: "#111827",
              borderRadius: 12,
            },
          }}
          inputProps={{ autoComplete: "new-org-name" }}
        />

        <Box sx={{ display: "flex", flexDirection: "row", alignItems: "flex-end", gap: 2, mt: 2 }}>
          <Box sx={{ flex: "1 1 220px", minWidth: 0 }}>
            <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", mb: 0.5 }}>
              <Typography variant="body2" sx={{ fontWeight: 500, color: "#4b5563", textAlign: "left", flex: 1 }}>
                Owner email
              </Typography>
              {emailError && (
                <Typography variant="caption" color="error" sx={{ minWidth: 0, textAlign: "right", flex: 1 }}>
                  {emailError}
                </Typography>
              )}
            </Box>

            <TextField
              fullWidth
              type="email"
              placeholder="owner@email.com"
              size="medium"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={!!emailError}
              autoComplete="off"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 3,
                  bgcolor: "#f4f6fb",
                  height: 42,
                  "& fieldset": { borderColor: "#dde3f0" },
                  "&:hover fieldset": { borderColor: "#cfd6e6" },
                  "&.Mui-focused fieldset": { borderColor: "#a5b1c8" },
                },
                "& input:-webkit-autofill, & input:-webkit-autofill:focus": {
                  WebkitBoxShadow: "0 0 0 1000px #f4f6fb inset",
                  WebkitTextFillColor: "#111827",
                  borderRadius: 12,
                },
              }}
              inputProps={{ autoComplete: "new-owner-email" }}
            />
          </Box>

          <Box sx={{ flex: "0 0 100px" }}>
            <Button
              type="submit"
              variant="contained"
              size="small"
              sx={{
                width: "100%",
                fontWeight: 500,
                textTransform: "none",
                borderRadius: 3,
                py: 0.5,
                minHeight: 28,
                bgcolor: "#6f7688",
                boxShadow: "none",
                border: "2px solid #6f7688",
                fontSize: "1rem",
                "&:hover": {
                  bgcolor: "#636a7b",
                  boxShadow: "none",
                  border: "2px solid #636a7b",
                },
                "&:focus": { border: "2px solid #636a7b", outline: "none" },
                "&:active": { border: "2px solid #636a7b", outline: "none" },
              }}
            >
              Add
            </Button>
          </Box>
        </Box>
      </Box>

      <Snackbar
        open={snackOpen}
        autoHideDuration={3000}
        onClose={() => setSnackOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={() => setSnackOpen(false)} severity={snackSeverity} sx={{ width: "100%" }}>
          {snackMsg}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default AddOrganizationForm;
