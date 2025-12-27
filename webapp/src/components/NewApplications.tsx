import React, { useEffect, useMemo, useState } from "react";
import { downloadDocumentWithAuth } from "../utils/download";

import {
  Paper,
  Box,
  Typography,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Pagination,
  IconButton,
  Tooltip,
  CircularProgress,
  Snackbar,
  Alert,
  Button,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloudDownloadOutlinedIcon from "@mui/icons-material/CloudDownloadOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

const BASE_URL = "http://localhost:8081";

type SortMode = "newest" | "oldest";

type ApplicationRow = {
  id: number;
  email: string;
  file: string; // cvFileName
  cvDocumentId?: number;
};

type ApplicationDto = {
  id: number;
  applicantEmail?: string | null;
  email?: string | null;
  cvFileName?: string | null;
  file?: string | null;
  cvDocumentId?: number | null;
};

const PAGE_SIZE = 11;
const ROW_HEIGHT = 34;

const headCellSx = {
  px: 1.25,
  fontWeight: 500,
  color: "#B5B7C0",
  borderBottom: "1px solid #e3e8f2",
  textAlign: "left" as const,
  fontSize: "0.8rem",
};

const bodyCellSx = {
  px: 1.25,
  fontSize: "0.8rem",
  borderBottom: "1px solid #e3e8f2",
  textAlign: "left" as const,
};

const actionIconSx = {
  color: "#6f7688",
  p: 0.4,
  "&:hover": { backgroundColor: "transparent", color: "#3D3C42" },
  "&:focus, &:active, &:focus-visible, &.Mui-focusVisible": {
    outline: "none",
    backgroundColor: "transparent",
    boxShadow: "none",
  },
} as const;

interface Props {
  onBack: () => void;
}

const NewApplications: React.FC<Props> = ({ onBack }) => {
  const token = useMemo(() => localStorage.getItem("token"), []);
  const [rows, setRows] = useState<ApplicationRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortMode>("newest");
  const [page, setPage] = useState(1);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error" | "info">("success");

  const openSnack = (m: string, s: "success" | "error" | "info" = "success") => {
    setSnackbarMsg(m);
    setSnackbarSeverity(s);
    setSnackbarOpen(true);
  };

  async function loadApps(signal?: AbortSignal) {
    if (!token) {
      setErr("Not authenticated (missing token).");
      setRows([]);
      return;
    }

    setLoading(true);
    setErr(null);

    try {
      const res = await fetch(`${BASE_URL}/applications`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
        signal,
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(`Failed to load applications (${res.status}). ${txt}`);
      }

      const data = await res.json();
      const list: ApplicationDto[] = Array.isArray(data) ? (data as ApplicationDto[]) : [];

      const mapped: ApplicationRow[] = list.map((a) => ({
        id: Number(a?.id),
        email: String(a?.applicantEmail ?? a?.email ?? ""),
        file: String(a?.cvFileName ?? a?.file ?? "-"),
        cvDocumentId: a?.cvDocumentId != null ? Number(a.cvDocumentId) : undefined,
      }));

      setRows(mapped);
      setPage(1);
    } catch (e: unknown) {
      if (e instanceof DOMException && e.name === "AbortError") return;
      const msg = e instanceof Error ? e.message : "Failed to load applications.";
      setErr(msg);
      setRows([]);
    } finally {
      setLoading(false);
    }
  }

  async function acceptApplication(appId: number) {
    if (!token) return openSnack("Not authenticated (missing token).", "error");

    try {
      const res = await fetch(`${BASE_URL}/applications/${appId}/accept`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(`Accept failed (${res.status}). ${txt}`);
      }

      setRows((prev) => prev.filter((r) => r.id !== appId));
      openSnack("Application accepted and user added to your organization.", "success");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Accept failed.";
      openSnack(msg, "error");
    }
  }

  async function rejectApplication(appId: number) {
    if (!token) return openSnack("Not authenticated (missing token).", "error");

    try {
      const res = await fetch(`${BASE_URL}/applications/${appId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(`Reject failed (${res.status}). ${txt}`);
      }

      setRows((prev) => prev.filter((r) => r.id !== appId));
      openSnack("Application rejected.", "info");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Accept failed.";
      openSnack(msg, "error");
    }
  }

  useEffect(() => {
    const controller = new AbortController();
    loadApps(controller.signal);
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // filter + sort + paginate
  let filtered = rows.filter((r) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return r.email.toLowerCase().includes(q) || r.file.toLowerCase().includes(q);
  });

  if (sort === "newest") filtered = [...filtered]; // API deja e desc; lăsăm așa
  if (sort === "oldest") filtered = [...filtered].reverse();

  const total = filtered.length;
  const pageCount = Math.ceil(total / PAGE_SIZE) || 1;
  const safePage = Math.min(page, pageCount);
  const pageRows = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const startIdx = total === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1;
  const endIdx = Math.min(safePage * PAGE_SIZE, total);

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
          Back to statistics
        </Button>
      </Box>

      <Box
        sx={{
          mb: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700, color: "#222" }}>
          New applications
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
          <TextField
            placeholder="Search"
            size="small"
            autoComplete="off"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            sx={{
              bgcolor: "#f4f6fb",
              borderRadius: 2,
              width: { xs: 180, sm: 220 },
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                height: 36,
                fontSize: "0.85rem",
                "& fieldset": { borderColor: "#dde3f0" },
                "&:hover fieldset": { borderColor: "#cfd6e6" },
                "&.Mui-focused fieldset": { borderColor: "#a5b1c8" },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "#3D3C42", fontSize: 18 }} />
                </InputAdornment>
              ),
            }}
          />

          <Select
            value={sort}
            onChange={(e) => {
              setSort(e.target.value as SortMode);
              setPage(1);
            }}
            size="small"
            sx={{
              bgcolor: "#f4f6fb",
              borderRadius: 2,
              height: 36,
              minWidth: 150,
              fontWeight: 500,
              fontSize: "0.85rem",
              "& .MuiOutlinedInput-notchedOutline": { borderColor: "#dde3f0 !important" },
              "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#cfd6e6 !important" },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#a5b1c8 !important" },
            }}
            renderValue={(selected) => (
              <span>
                <span style={{ color: "#7E7E7E" }}>Sort by : </span>
                <b style={{ color: "#222" }}>{selected === "oldest" ? "Oldest" : "Newest"}</b>
              </span>
            )}
          >
            <MenuItem value="newest" sx={{ fontSize: "0.85rem", py: 0.5 }}>
              <b style={{ color: "#222" }}>Newest</b>
            </MenuItem>
            <MenuItem value="oldest" sx={{ fontSize: "0.85rem", py: 0.5 }}>
              <b style={{ color: "#222" }}>Oldest</b>
            </MenuItem>
          </Select>
        </Box>
      </Box>

      {err && (
        <Box sx={{ mb: 1 }}>
          <Typography sx={{ color: "#d32f2f", fontWeight: 600, fontSize: "0.9rem" }}>{err}</Typography>
        </Box>
      )}

      <Box sx={{ flex: 1, minHeight: 0 }}>
        <Box sx={{ overflowX: "auto" }}>
          <Table sx={{ tableLayout: "fixed", width: "100%", borderCollapse: "collapse" }}>
            <TableHead>
              <TableRow sx={{ "& th": { py: 0.8 } }}>
                <TableCell sx={{ ...headCellSx, width: "40%" }}>Email</TableCell>
                <TableCell sx={{ ...headCellSx, width: "35%" }}>File</TableCell>
                <TableCell sx={{ ...headCellSx, width: "25%" }}>Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {loading ? (
                <TableRow sx={{ height: ROW_HEIGHT }}>
                  <TableCell colSpan={3} sx={{ ...bodyCellSx, borderBottom: "none" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <CircularProgress size={16} />
                      <Typography sx={{ color: "#7b8bb2", fontWeight: 500, fontSize: "0.9rem" }}>
                        Loading applications...
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : pageRows.length ? (
                pageRows.map((r) => (
                  <TableRow key={r.id} sx={{ height: ROW_HEIGHT, "& td": { py: 0.8 } }}>
                    <TableCell sx={{ ...bodyCellSx, color: "#222", fontWeight: 500 }}>
                      {r.email}
                    </TableCell>

                    <TableCell
                      sx={{
                        ...bodyCellSx,
                        color: r.file === "-" ? "#b5b7c0" : "#67728A",
                        fontWeight: 500,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {r.file}
                    </TableCell>

                    <TableCell sx={{ ...bodyCellSx, whiteSpace: "nowrap" }}>
                      {/* Download */}
                      <Tooltip title="Download file" arrow>
                        <span>
                          <IconButton
                            size="small"
                            disableRipple
                            sx={{ ...actionIconSx, mr: 0.75 }}
                            disabled={!r.cvDocumentId}
                            onClick={async () => {
                              try {
                                const token = localStorage.getItem("token");
                                if (!token) {
                                  openSnack("Not authenticated (missing token).", "error");
                                  return;
                                }
                                if (!r.cvDocumentId) {
                                  openSnack("No document attached to this application.", "info");
                                  return;
                                }

                                await downloadDocumentWithAuth(r.cvDocumentId, token, r.file);
                              } catch (e: unknown) {
                                const msg = e instanceof Error ? e.message : "Accept failed.";
                                openSnack(msg, "error");
                              }
                            }}
                          >
                            <CloudDownloadOutlinedIcon fontSize="inherit" />
                          </IconButton>
                        </span>
                      </Tooltip>


                      {/* Accept */}
                      <Tooltip title="Accept application" arrow>
                        <IconButton
                          size="small"
                          disableRipple
                          sx={{ ...actionIconSx, mr: 0.75 }}
                          onClick={() => acceptApplication(r.id)}
                        >
                          <CheckCircleOutlineIcon fontSize="inherit" />
                        </IconButton>
                      </Tooltip>

                      {/* Reject */}
                      <Tooltip title="Reject application" arrow>
                        <IconButton
                          size="small"
                          disableRipple
                          sx={actionIconSx}
                          onClick={() => rejectApplication(r.id)}
                        >
                          <CloseOutlinedIcon fontSize="inherit" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow sx={{ height: ROW_HEIGHT }}>
                  <TableCell colSpan={3} sx={{ ...bodyCellSx, textAlign: "center" }}>
                    <Typography sx={{ color: "#b5b7c0", fontWeight: 500, fontSize: "0.9rem" }}>
                      No results...
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mt: 1.5,
            flexWrap: "wrap",
          }}
        >
          <Typography
            variant="body2"
            sx={{ color: "#B5B7C0", fontWeight: 500, textAlign: "left", fontSize: "0.75rem" }}
          >
            {total === 0 ? "Showing data 0 of 0 entries" : `Showing data ${startIdx} to ${endIdx} of ${total} entries`}
          </Typography>

          <Pagination
            count={pageCount}
            page={safePage}
            onChange={(_, v) => setPage(v)}
            siblingCount={1}
            boundaryCount={1}
            shape="rounded"
            size="small"
            sx={{
              "& .MuiPaginationItem-root": {
                fontSize: "0.75rem",
                minWidth: 24,
                height: 24,
                boxShadow: "none !important",
                borderColor: "#67728A !important",
                padding: "2px 6px",
                outline: "none !important",
              },
              "& .Mui-selected": {
                backgroundColor: "#67728A !important",
                color: "#fff !important",
                borderColor: "#67728A !important",
                borderWidth: "1.5px",
                borderStyle: "solid",
              },
              "& .Mui-selected:hover": { backgroundColor: "#5a6276 !important" },
            }}
            showFirstButton={false}
            showLastButton={false}
          />
        </Box>
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={snackbarSeverity} sx={{ width: "100%" }}>
          {snackbarMsg}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default NewApplications;
