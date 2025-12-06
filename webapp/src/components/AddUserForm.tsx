import React, { useState } from "react";
import { Paper, Typography, TextField, FormControl, Select, MenuItem, Button, Box, Snackbar, Alert } from "@mui/material";

const AddUserForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [emailError, setEmailError] = useState("");
  const [roleError, setRoleError] = useState("");
  const [successOpen, setSuccessOpen] = useState(false);

  const validateEmail = (value: string) => {
    // Simple email regex
    return /^[\w-.]+@[\w-]+\.[a-zA-Z]{2,}$/.test(value);
  };

  const handleAddUser = () => {
    let valid = true;
    if (!validateEmail(email)) {
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
    // ...submit logic here
    setSuccessOpen(true);
    setEmail("");
    setRole("");
  };

  return (
    <Paper
      style={{
        padding: 18,
        borderRadius: 24,
        background: "#fff",
        boxShadow: "0 2px 16px #bfcbe6",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography variant="h6" style={{ fontWeight: 700, marginBottom: 8, textAlign: "left" }}>
        Add new user
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', mb: 0.75 }}>
          <Typography
            variant="body2"
            sx={{ fontWeight: 500, color: '#4b5563', textAlign: 'left', flex: 1 }}
          >
            Email
          </Typography>
          {emailError && (
            <Typography variant="caption" color="error" sx={{ minWidth: 0, textAlign: 'right', flex: 1 }}>
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
          onChange={e => setEmail(e.target.value)}
          error={!!emailError}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 3,
              bgcolor: '#f4f6fb',
              height: 42,
              '& fieldset': {
                borderColor: '#dde3f0',
              },
              '&:hover fieldset': {
                borderColor: '#cfd6e6',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#a5b1c8',
              },
            },
          }}
          inputProps={{
            autoComplete: 'off',
          }}
        />
        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', mb: 0.75, mt: 2 }}>
          <Typography
            variant="body2"
            sx={{ fontWeight: 500, color: '#4b5563', textAlign: 'left', flex: 1 }}
          >
            Role
          </Typography>
          {roleError && (
            <Typography variant="caption" color="error" sx={{ minWidth: 0, textAlign: 'right', flex: 1 }}>
              {roleError}
            </Typography>
          )}
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, alignItems: 'flex-end', mt: 0 }}>
          <Box sx={{ flex: 1 }}>
            <FormControl fullWidth variant="outlined" error={!!roleError}>
              <Select
                value={role}
                onChange={e => setRole(e.target.value as string)}
                displayEmpty
                sx={{
                  bgcolor: '#f4f6fb',
                  borderRadius: 3,
                  height: 42,
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#dde3f0',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#cfd6e6',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#a5b1c8',
                  },
                }}
              >
                <MenuItem value="" disabled>Choose an option</MenuItem>
                <MenuItem value="user">User</MenuItem>
                <MenuItem value="hr">HR</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Button
            variant="contained"
            size="small"
            onClick={handleAddUser}
            sx={{
              minWidth: 120,
              fontWeight: 500,
              textTransform: 'none',
              borderRadius: 3,
              py: 0.5,
              minHeight: 28,
              bgcolor: '#6f7688',
              boxShadow: 'none',
              border: '2px solid #6f7688',
              fontSize: '1rem',
              alignSelf: 'flex-end',
              '&:hover': {
                bgcolor: '#636a7b',
                boxShadow: 'none',
                border: '2px solid #636a7b',
              },
              '&:focus': {
                border: '2px solid #636a7b',
                outline: 'none',
              },
              '&:active': {
                border: '2px solid #636a7b',
                outline: 'none',
              },
            }}
          >
            Add user
          </Button>
        </Box>
      </Box>
    <Snackbar open={successOpen} autoHideDuration={3000} onClose={() => setSuccessOpen(false)} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
      <Alert onClose={() => setSuccessOpen(false)} severity="success" sx={{ width: '100%' }}>
        User was successfully added
      </Alert>
    </Snackbar>
  </Paper>
  );
};

export default AddUserForm;
