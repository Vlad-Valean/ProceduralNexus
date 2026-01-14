import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useUserLogs } from "../hooks/useUserLogs";
import type { UserLog } from "../hooks/useUserLogs";
import Navbar from "../components/Navbar";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  TextField,
  Chip,
  Button,
  CircularProgress,
  Typography,
  Snackbar,
  Alert,
  Menu,
  MenuItem,
  Checkbox,
  ListItemText,
  FormControl
} from '@mui/material';
import { FileDownload, FilterList, Edit } from '@mui/icons-material';
import Pagination from '@mui/material/Pagination';
import { downloadDocumentWithAuth } from "../utils/download";

const BASE_URL = "http://localhost:8080";

interface ProfileDto {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
}

interface DocumentDto {
  id: number;
  fileName: string;
  name?: string;
  signed: boolean;
  type?: string;
}

interface UserDocument {
  id: number;
  name: string;
  status: 'Signed' | 'Unsigned';
}

const statusOptions = [
  { value: 'Signed', label: 'Signed' },
  { value: 'Unsigned', label: 'Unsigned' }
];

const UserDashboard: React.FC = () => {
  const { fetchUserLogs } = useUserLogs();
  const [userLogs, setUserLogs] = useState<UserLog[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);
  
  const [userId, setUserId] = useState<string | null>(null);
  const [documents, setDocuments] = useState<UserDocument[]>([]);

  const [loadingProfile, setLoadingProfile] = useState<boolean>(true);
  const [loadingDocs, setLoadingDocs] = useState<boolean>(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const rowsPerPage = 7;

  const [sortMenuAnchor, setSortMenuAnchor] = useState<null | HTMLElement>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");

  const token = useMemo(() => localStorage.getItem("token"), []);
  const userEmail = useMemo(() => localStorage.getItem("userEmail"), []);

  const fetchUserId = useCallback(async () => {
    if (!token || !userEmail) {
      setLoadError("Not authenticated (missing token or email).");
      setLoadingProfile(false);
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/profiles`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        throw new Error("Failed to load profiles list.");
      }

      const profiles: ProfileDto[] = await res.json();
      const foundProfile = profiles.find(p => p.email?.toLowerCase() === userEmail.toLowerCase());

      if (foundProfile) {
        setUserId(foundProfile.id);
      } else {
        setLoadError("User profile not found for the current email.");
      }
    } catch (e: unknown) {
      setLoadError(e instanceof Error ? e.message : "Failed to identify user.");
    } finally {
      setLoadingProfile(false);
    }
  }, [token, userEmail]);

  const loadDocuments = useCallback(
    async (currentUserId: string, signal?: AbortSignal) => {
      if (!token) return;

      setLoadingDocs(true);
      setLoadError(null);

      try {
        const res = await fetch(`${BASE_URL}/documents?uploaderId=${currentUserId}`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
          signal,
        });

        if (!res.ok) {
          const txt = await res.text().catch(() => "");
          throw new Error(`Request failed (${res.status}). ${txt}`);
        }

        const data: DocumentDto[] = await res.json();

        const dataWithoutCv = data.filter(d => (d.type ?? "").toUpperCase() !== "CV");

        const mappedDocs: UserDocument[] = dataWithoutCv.map((d) => ({
          id: d.id,
          name: d.name || d.fileName || "Unnamed Document",
          status: d.signed ? 'Signed' : 'Unsigned'
        }));

        mappedDocs.sort((a, b) => b.id - a.id);

        setDocuments(mappedDocs);
      } catch (e: unknown) {
        if (e instanceof DOMException && e.name === "AbortError") return;
        setLoadError(e instanceof Error ? e.message : "Failed to load documents.");
      } finally {
        setLoadingDocs(false);
      }
    },
    [token]
  );

  const toggleDocumentStatus = useCallback(async (doc: UserDocument) => {
    if (!token) return;

    const newSignedStatus = doc.status !== 'Signed';

    try {
      const res = await fetch(`${BASE_URL}/documents/${doc.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ signed: newSignedStatus }),
      });

      if (!res.ok) throw new Error("Failed to update status");

      setDocuments(prev => prev.map(d =>
        d.id === doc.id
          ? { ...d, status: newSignedStatus ? 'Signed' : 'Unsigned' }
          : d
      ));

      // Log the action
      try {
        const { sendLog } = await import("../services/logService");
        await sendLog("DOCUMENT_SIGNED", `Document ${newSignedStatus ? 'signed' : 'unsigned'}: ${doc.name}`);
      } catch {
        // Ignore logging failures
      }

      setSnackbarMessage(`Document marked as ${newSignedStatus ? 'Signed' : 'Unsigned'}`);
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch {
      setSnackbarMessage("Failed to update document status");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  }, [token]);

  const handleDownload = useCallback(async (doc: UserDocument) => {
    if (!token) return;
    try {
      await downloadDocumentWithAuth(doc.id, token, doc.name);
      
      // Log the download action
      try {
        const { sendLog } = await import("../services/logService");
        await sendLog("DOCUMENT_DOWNLOADED", `Downloaded document: ${doc.name}`);
      } catch {
        // Ignore logging failures
      }
    } catch {
      setSnackbarMessage("Download failed");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  }, [token]);

  useEffect(() => {
    fetchUserId();
  }, [fetchUserId]);

  useEffect(() => {
    if (userId) {
      const controller = new AbortController();
      loadDocuments(userId, controller.signal);
      return () => controller.abort();
    }
  }, [userId, loadDocuments]);

  useEffect(() => {
    setPage(1);
  }, [searchQuery, statusFilter]);

  // Fetch user logs pentru recent activity
  useEffect(() => {
    const t = localStorage.getItem("token");
    if (!t) return;
    setLoadingLogs(true);
    fetchUserLogs(t)
      .then((logs) => {
        setUserLogs(
          logs.filter((l) => ["DOCUMENT_ASSIGNED", "DOCUMENT_VIEWED", "DOCUMENT_DOWNLOADED", "DOCUMENT_SIGNED"].includes(l.action))
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        );
      })
      .finally(() => setLoadingLogs(false));
  }, [fetchUserLogs]);

  const filteredDocuments = useMemo(() => {
    let docs = [...documents];
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      docs = docs.filter(
        doc =>
          doc.name.toLowerCase().includes(q) ||
          doc.status.toLowerCase().includes(q)
      );
    }
    if (statusFilter.length > 0) {
      docs = docs.filter(doc => statusFilter.includes(doc.status));
    }
    return docs;
  }, [documents, searchQuery, statusFilter]);

  const stats = useMemo(() => {
    const signed = documents.filter(d => d.status === 'Signed').length;
    const unsigned = documents.filter(d => d.status === 'Unsigned').length;
    return { signed, unsigned };
  }, [documents]);

  const totalPages = Math.ceil(filteredDocuments.length / rowsPerPage);
  const paginatedDocuments = filteredDocuments.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const getStatusColor = (status: UserDocument['status']) => {
    return status === 'Signed'
      ? { bg: 'rgba(18, 183, 106, 0.1)', color: '#12B76A' }
      : { bg: 'rgba(37, 99, 235, 0.1)', color: '#2563EB' };
  };

  const isGlobalLoading = loadingProfile;

  return (
    <>
      <Navbar />
      <main
        style={{
          padding: "10px 32px 10px",
          minHeight: `calc(100vh - 60px)`,
          boxSizing: "border-box",
          overflowY: "auto",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 2fr) minmax(0, 1fr)",
              gap: 22,
              alignItems: "stretch",
            }}
          >
            {/* Left Column: Documents List */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20, minHeight: 0 }}>
              <Paper
                sx={{
                  borderRadius: '12px',
                  border: '1px solid #E6E8EE',
                  boxShadow: '0px 8px 24px rgba(16, 24, 40, 0.08)',
                  backgroundColor: 'white',
                  overflow: 'hidden',
                  minHeight: 662,
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                {/* Header & Filters */}
                <Box sx={{ p: 3, borderBottom: '1px solid #E6E8EE' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography
                      sx={{
                        fontSize: '20px',
                        fontWeight: 600,
                        color: '#111827',
                        fontFamily: 'Inter, system-ui, Helvetica, Arial, sans-serif'
                      }}
                    >
                      Check your documents
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <TextField
                      size="small"
                      placeholder="Search documents"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      autoComplete="off"
                      sx={{
                        flex: 1,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '10px',
                          backgroundColor: 'white',
                          fontSize: '14px',
                          '& fieldset': { borderColor: '#E6E8EE' },
                        }
                      }}
                    />
                    <FormControl sx={{ minWidth: 180 }}>
                      <Button
                        variant="outlined"
                        onClick={(e) => setSortMenuAnchor(e.currentTarget)}
                        sx={{
                          borderRadius: '10px',
                          fontSize: '14px',
                          height: 40,
                          color: '#222',
                          borderColor: '#E6E8EE',
                          textTransform: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                        }}
                      >
                        <FilterList sx={{ fontSize: 20, mr: 1 }} />
                        Filter
                      </Button>
                      <Menu
                        anchorEl={sortMenuAnchor}
                        open={Boolean(sortMenuAnchor)}
                        onClose={() => setSortMenuAnchor(null)}
                        PaperProps={{ sx: { minWidth: 165, p: 1 } }}
                      >
                        <Typography sx={{ px: 2, pt: 1, pb: 0.5, fontWeight: 600, fontSize: '0.85rem', color: '#222' }}>
                          Document status
                        </Typography>
                        {statusOptions.map(option => (
                          <MenuItem
                            key={option.value}
                            value={option.value}
                            onClick={() => {
                              setStatusFilter(prev =>
                                prev.includes(option.value)
                                  ? prev.filter(v => v !== option.value)
                                  : [...prev, option.value]
                              );
                            }}
                            sx={{ pl: 2, minHeight: 28, py: 0.2 }}
                          >
                            <Checkbox
                              checked={statusFilter.includes(option.value)}
                              sx={{ p: 0.3, mr: 1, color: '#67728A' }}
                            />
                            <ListItemText primary={option.label} />
                          </MenuItem>
                        ))}
                      </Menu>
                    </FormControl>
                  </Box>
                </Box>

                {/* Table Content */}
                <TableContainer sx={{ flex: '1 1 auto' }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontSize: '12px', fontWeight: 500, color: '#667085', textTransform: 'uppercase', borderBottom: '1px solid #E6E8EE' }}>Name</TableCell>
                        <TableCell sx={{ fontSize: '12px', fontWeight: 500, color: '#667085', textTransform: 'uppercase', borderBottom: '1px solid #E6E8EE' }}>Status</TableCell>
                        <TableCell sx={{ fontSize: '12px', fontWeight: 500, color: '#667085', textTransform: 'uppercase', borderBottom: '1px solid #E6E8EE' }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {isGlobalLoading || loadingDocs ? (
                        <TableRow>
                          <TableCell colSpan={3} sx={{ py: 6, textAlign: 'center', border: 0 }}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                              <CircularProgress />
                              {isGlobalLoading && <Typography variant="caption">Identifying user...</Typography>}
                            </Box>
                          </TableCell>
                        </TableRow>
                      ) : paginatedDocuments.length > 0 ? (
                        paginatedDocuments.map((doc) => {
                          const statusColor = getStatusColor(doc.status);
                          return (
                            <TableRow key={doc.id} hover sx={{ height: 54, '& td': { py: 1 } }}>
                              <TableCell sx={{ fontSize: '14px', color: '#111827', borderBottom: '1px solid #E6E8EE' }}>
                                {doc.name}
                              </TableCell>
                              <TableCell sx={{ borderBottom: '1px solid #E6E8EE' }}>
                                <Chip
                                  label={doc.status}
                                  size="small"
                                  sx={{
                                    backgroundColor: statusColor.bg,
                                    color: statusColor.color,
                                    fontSize: '12px',
                                    fontWeight: 500,
                                    borderRadius: '999px',
                                    height: '24px'
                                  }}
                                />
                              </TableCell>
                              <TableCell sx={{ borderBottom: '1px solid #E6E8EE' }}>
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                  <IconButton
                                    size="small"
                                    sx={{ color: '#667085' }}
                                    title={doc.status === 'Signed' ? "Mark as Unsigned" : "Mark as Signed"}
                                    onClick={() => toggleDocumentStatus(doc)}
                                  >
                                    <Edit sx={{ fontSize: 16 }} />
                                  </IconButton>
                                  <IconButton
                                    size="small"
                                    sx={{ color: '#667085' }}
                                    onClick={() => handleDownload(doc)}
                                  >
                                    <FileDownload sx={{ fontSize: 16 }} />
                                  </IconButton>
                                </Box>
                              </TableCell>
                            </TableRow>
                          );
                        })
                      ) : (
                        <TableRow>
                          <TableCell colSpan={3} sx={{ py: 6, textAlign: 'center', border: 0 }}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                              <Typography sx={{ color: "#b5b7c0", fontWeight: 600, fontSize: "1.15rem" }}>
                                {loadError ? loadError : "No documents found."}
                              </Typography>
                            </Box>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>

                {/* Footer / Pagination */}
                <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
                  <Typography sx={{ color: "#B5B7C0", fontWeight: 500, fontSize: "0.75rem" }}>
                    {filteredDocuments.length === 0
                      ? "Showing data 0 to 0 of 0 entries"
                      : `Showing data ${(page - 1) * rowsPerPage + 1} to ${Math.min(page * rowsPerPage, filteredDocuments.length)} of ${filteredDocuments.length} entries`}
                  </Typography>
                  <Pagination
                    count={totalPages}
                    page={page}
                    onChange={(_, value) => setPage(value)}
                    siblingCount={1}
                    boundaryCount={1}
                    color="primary"
                    shape="rounded"
                    size="small"
                    sx={{ "& .Mui-selected": { backgroundColor: "#67728A !important" } }}
                  />
                </Box>
              </Paper>
            </div>

            {/* Right Column: Stats & Activity */}
            <div style={{ minHeight: 0, display: "flex", flexDirection: "column", gap: 22 }}>
              {/* Stats Card */}
              <Paper
                sx={{
                  p: 3,
                  borderRadius: '12px',
                  border: '1px solid #E6E8EE',
                  boxShadow: '0px 8px 24px rgba(16, 24, 40, 0.08)',
                  backgroundColor: 'white'
                }}
              >
                <Typography sx={{ fontSize: '20px', fontWeight: 600, mb: 3, color: '#111827' }}>
                  Your documents in numbers
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-around', mb: 3 }}>
                  {[
                    { label: 'UNSIGNED', value: stats.unsigned, color: '#2563EB' },
                    { label: 'SIGNED', value: stats.signed, color: '#12B76A' }
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
                          mx: 'auto'
                        }}
                      >
                        <Typography sx={{ fontSize: '20px', fontWeight: 600, color: stat.color }}>
                          {stat.value}
                        </Typography>
                      </Box>
                      <Typography sx={{ fontSize: '12px', fontWeight: 500, color: '#667085', letterSpacing: '0.02em' }}>
                        {stat.label}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Paper>

              {/* Recent Activity Card */}
              <Paper
                sx={{
                  p: 3,
                  borderRadius: '12px',
                  border: '1px solid #E6E8EE',
                  boxShadow: '0px 8px 24px rgba(16, 24, 40, 0.08)',
                  backgroundColor: 'white',
                  flex: 1
                }}
              >
                <Typography sx={{ fontSize: '20px', fontWeight: 600, mb: 3, color: '#111827' }}>
                  Recent activity
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {loadingLogs ? (
                    <Typography sx={{ color: '#98A2B3' }}>Loading activity...</Typography>
                  ) : userLogs.length === 0 ? (
                    <Typography sx={{ color: '#98A2B3' }}>No recent activity.</Typography>
                  ) : (
                    userLogs.map((log) => (
                      <Box key={log.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2 }}>
                        <Typography sx={{ fontSize: '14px', color: '#111827', flex: 1 }}>
                          {formatLogText(log)}
                        </Typography>
                        <Typography sx={{ fontSize: '12px', color: '#98A2B3', whiteSpace: 'nowrap' }}>
                          {new Date(log.createdAt).toLocaleDateString()}
                        </Typography>
                      </Box>
                    ))
                  )}
                </Box>
              </Paper>
            </div>
          </div>
        </div>
      </main>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={snackbarSeverity} onClose={() => setSnackbarOpen(false)}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

// Helper pentru a formata textul logului pentru UI
function formatLogText(log: UserLog) {
  switch (log.action) {
    case "DOCUMENT_ASSIGNED":
      return log.description || "Document assigned.";
    case "DOCUMENT_VIEWED":
      return log.description || "Document viewed.";
    case "DOCUMENT_DOWNLOADED":
      return log.description || "Document downloaded.";
    case "DOCUMENT_SIGNED":
      return log.description || "Document signed.";
    default:
      return log.description || log.action;
  }
}

export default UserDashboard;
