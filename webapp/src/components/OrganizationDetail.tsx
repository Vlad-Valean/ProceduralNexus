import React, {useState } from "react";
import {
  Paper,
  Box,
  Typography,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import type { OrganizationDetail } from "../utils/admin";

const BASE_URL = "http://localhost:8081";

type Props = {
  organization: OrganizationDetail;
  loading: boolean;
  error: string | null;
  onBack: () => void;
  onShowLogs: (target: string | null) => void;
  onDeleted: () => void;
};

const OrganizationDetailComp: React.FC<Props> = ({
  organization,
  loading,
  error,
  onBack,
  onShowLogs,
  onDeleted,
}) => {
  const token = localStorage.getItem("token") ?? "";
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMsg, setSnackMsg] = useState("");
  const [snackSeverity, setSnackSeverity] = useState<"success" | "error">("success");

  const openSnack = (msg: string, severity: "success" | "error") => {
    setSnackMsg(msg);
    setSnackSeverity(severity);
    setSnackOpen(true);
  };

  const handleDelete = async () => {
    if (!token) {
      openSnack("Not authenticated (missing token).", "error");
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/organizations/${organization.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok && res.status !== 204) {
        const txt = await res.text().catch(() => "");
        throw new Error(`Delete failed (${res.status}). ${txt}`);
      }

      setDeleteOpen(false);
      openSnack("Organization deleted.", "success");
      onDeleted();
    } catch (e: unknown) {
      openSnack(e instanceof Error ? e.message : "Failed to delete organization.", "error");
    }
  };

  const ownerLabel =
    organization.ownerEmail ??
    [organization.ownerFirstName, organization.ownerLastName].filter(Boolean).join(" ") ??
    "-";

  return (
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
        width: "100%",
        minWidth: 0,
        boxSizing: "border-box",
        height: "100%",
        minHeight: 630,
      }}
    >
      <Box sx={{ mb: 1, display: "flex", justifyContent: "flex-start" }}>
        <Button
          onClick={onBack}
          startIcon={<ArrowBackIosNewIcon sx={{ fontSize: 14 }} />}
          sx={{
            textTransform: "none",
            color: "#67728A",
            fontWeight: 500,
            fontSize: "0.9rem",
            px: 0,
            "&:hover": { backgroundColor: "transparent", color: "#3D3C42" },
          }}
        >
          Back
        </Button>
      </Box>

      <Box
        sx={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          mb: 0.5,
          gap: 2,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            color: "#222",
            fontWeight: 700,
            textAlign: "left",
            fontSize: { xs: "1.3rem", sm: "1.5rem" },
            flex: 1,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          Organization name
        </Typography>
        <Button
          variant="contained"
          startIcon={<DeleteOutlineIcon />}
          onClick={() => setDeleteOpen(true)}
          sx={{
            textTransform: "none",
            borderRadius: 2,
            px: 2,
            py: 0.6,
            bgcolor: "#A71818",
            boxShadow: "none",
            fontWeight: 700,
            fontSize: "0.85rem",
            "&:hover": { bgcolor: "#871414", boxShadow: "none" },
          }}
        >
          Delete organization
        </Button>
      </Box>

      {error && (
        <Typography sx={{ color: "#d32f2f", fontWeight: 700, mb: 1 }}>
          {error}
        </Typography>
      )}

      <Typography sx={{ fontWeight: 800, color: "#111827", mb: 1 }}>
        Employees
      </Typography>

      <Box sx={{ flex: 1, minHeight: 0, overflow: "auto", borderRadius: 2, border: "1px solid #e3e8f2" }}>
        <Table sx={{ tableLayout: "fixed", width: "100%" }}>
          <TableHead>
            <TableRow sx={{ "& th": { py: 1 } }}>
              <TableCell sx={{ fontWeight: 600, color: "#B5B7C0" }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 600, color: "#B5B7C0" }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 600, color: "#B5B7C0" }}>Roles</TableCell>
              <TableCell sx={{ fontWeight: 600, color: "#B5B7C0", width: 170 }}>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} sx={{ py: 4, color: "#64748b" }}>
                  Loading employees...
                </TableCell>
              </TableRow>
            ) : organization.employeesList?.length ? (
              organization.employeesList.map((u) => {
                const name = `${u.firstname ?? ""} ${u.lastname ?? ""}`.trim() || "-";
                return (
                  <TableRow key={u.id} sx={{ "& td": { py: 1 } }}>
                    <TableCell sx={{ fontWeight: 600, color: "#111827" }}>{name}</TableCell>
                    <TableCell sx={{ color: "#67728A", fontWeight: 600 }}>{u.email ?? "-"}</TableCell>
                    <TableCell sx={{ color: "#111827", fontWeight: 600 }}>
                      {u.roles?.length ? u.roles.join(", ") : "-"}
                    </TableCell>
                    <TableCell>
                      {/* HARDCODAT: “Reset credentials” */}
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => openSnack("Reset credentials (hardcoded).", "success")}
                        sx={{ textTransform: "none", mr: 1 }}
                      >
                        Reset credentials
                      </Button>

                      {/* HARDCODAT logs: doar email se schimbă */}
                      <Button
                        variant="text"
                        size="small"
                        onClick={() => onShowLogs(u.email ?? "")}
                        sx={{ textTransform: "none", fontWeight: 700 }}
                      >
                        Check logs
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={4} sx={{ py: 4, color: "#64748b" }}>
                  No employees found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Box>

      {/* HARDCODAT: org logs (doar numele se schimbă) */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
        <Button
          variant="text"
          onClick={() => onShowLogs(`ORG:${organization.name}`)}
          sx={{ textTransform: "none", fontWeight: 800 }}
        >
          Check organization logs
        </Button>
      </Box>

      {/* Delete confirm */}
      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>Delete organization</DialogTitle>
        <DialogContent>
          Are you sure you want to delete <b>{organization.name}</b>? This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteOpen(false)} sx={{ textTransform: "none" }}>
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error" variant="contained" sx={{ textTransform: "none" }}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

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

export default OrganizationDetailComp;
