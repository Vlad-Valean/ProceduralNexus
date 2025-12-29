import React, { useMemo, useState } from "react";
import {
  Paper,
  Typography,
  TextField,
  FormControl,
  Select,
  MenuItem,
  Button,
  Box,
  Snackbar,
  Alert,
} from "@mui/material";

const BASE_URL = "http://localhost:8081";

type RoleUi = "user" | "hr";

interface AddUserFormProps {
  onUserAdded?: () => void | Promise<void>;
}

const AddUserForm: React.FC<AddUserFormProps> = ({ onUserAdded }) => {
  const token = localStorage.getItem("token");

  const [email, setEmail] = useState("");
  const [role, setRole] = useState<RoleUi | "">("");

  const [emailError, setEmailError] = useState("");
  const [roleError, setRoleError] = useState("");

  const [snackOpen, setSnackOpen] = useState(false);
  const [snackSeverity, setSnackSeverity] = useState<"success" | "error">("success");
  const [snackMsg, setSnackMsg] = useState("");

  const [adding, setAdding] = useState(false);

  const validateEmail = (value: string) => /^[\w-.]+@[\w-]+\.[a-zA-Z]{2,}$/.test(value);

  const openSnack = (msg: string, severity: "success" | "error") => {
    setSnackMsg(msg);
    setSnackSeverity(severity);
    setSnackOpen(true);
  };

  const handleAddUser = async () => {
    let valid = true;

    const trimmedEmail = email.trim();

    if (!validateEmail(trimmedEmail)) {
      setEmailError("Invalid email address*");
      valid = false;
    } else {
      setEmailError("");
    }

    if (!role) {
      setRoleError("Role is required*");
      valid = false;
    } else {
      setRoleError("");
    }

    if (!valid) return;

    if (!token) {
      openSnack("Not authenticated (missing token).", "error");
      return;
    }

    const backendRole = role === "hr" ? "HR" : "USER";

    setAdding(true);
    try {
      const res = await fetch(`${BASE_URL}/hr/users/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email: trimmedEmail, role: backendRole }),
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(`Add user failed (${res.status}). ${txt}`);
      }

      // succes -> refresh listă sus
      await onUserAdded?.();

      setEmail("");
      setRole("");
      setEmailError("");
      setRoleError("");

      openSnack("User was successfully added", "success");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Add user failed.";
      openSnack(msg, "error");
    } finally {
      setAdding(false);
    }
  };

  return (
    <Paper
      component="form"
      autoComplete="off"
      onSubmit={(e) => {
        e.preventDefault();
        if (!adding) handleAddUser();
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
        Add new user
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.25 }}>
        <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", mb: 0.75 }}>
          <Typography
            variant="body2"
            sx={{ fontWeight: 500, color: "#4b5563", textAlign: "left", flex: 1 }}
          >
            Email
          </Typography>
          {emailError && (
            <Typography
              variant="caption"
              color="error"
              sx={{ minWidth: 0, textAlign: "right", flex: 1 }}
            >
              {emailError}
            </Typography>
          )}
        </Box>

        <TextField
          fullWidth
          type="email"
          placeholder="new_user@email.com"
          size="medium"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={!!emailError}
          autoComplete="off"
          disabled={adding}
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
          inputProps={{ autoComplete: "new-user-email" }}
        />

        <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", mb: 0.75, mt: 2 }}>
          <Typography
            variant="body2"
            sx={{ fontWeight: 500, color: "#4b5563", textAlign: "left", flex: 1 }}
          >
            Role
          </Typography>
          {roleError && (
            <Typography
              variant="caption"
              color="error"
              sx={{ minWidth: 0, textAlign: "right", flex: 1 }}
            >
              {roleError}
            </Typography>
          )}
        </Box>

        <Box sx={{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: 2, alignItems: "flex-end" }}>
          <Box sx={{ flex: "1 1 220px", minWidth: 0 }}>
            <FormControl fullWidth variant="outlined" error={!!roleError} disabled={adding}>
              <Select
                value={role}
                onChange={(e) => setRole(e.target.value as RoleUi)}
                displayEmpty
                sx={{
                  bgcolor: "#f4f6fb",
                  borderRadius: 3,
                  height: 42,
                  "& .MuiOutlinedInput-notchedOutline": { borderColor: "#dde3f0" },
                  "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#cfd6e6" },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#a5b1c8" },
                }}
              >
                <MenuItem value="" disabled>
                  Choose an option
                </MenuItem>
                <MenuItem value="user">User</MenuItem>
                <MenuItem value="hr">HR</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ flex: "0 0 140px" }}>
            <Button
              type="submit"
              variant="contained"
              size="small"
              disabled={adding}
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
                "&.Mui-disabled": { bgcolor: "#c9ceda", color: "#ffffff", border: "2px solid #c9ceda" },
              }}
            >
              {adding ? "Adding..." : "Add user"}
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

export default AddUserForm;
