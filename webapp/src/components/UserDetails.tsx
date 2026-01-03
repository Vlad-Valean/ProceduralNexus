import React, { useEffect, useMemo, useState } from "react";
import { downloadDocumentWithAuth } from "../utils/download";
import type { ChangeEvent } from "react";
import {
  Paper,
  Box,
  Typography,
  Button,
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
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloudDownloadOutlinedIcon from "@mui/icons-material/CloudDownloadOutlined";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import DoNotDisturbOnOutlinedIcon from "@mui/icons-material/DoNotDisturbOnOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

const BASE_URL = "http://localhost:8080";

type DocumentType = "CV" | "OTHER";

interface UserDetailsProps {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role?: string;
    organization?: string;
  };
  onBackToStats?: () => void;
  onRemoveUser?: (userId: string) => Promise<void>;
}

type DocStatus = "signed" | "unsigned";

interface UserDocument {
  id: number;
  file: string;
  signed: boolean;
  status: DocStatus;
  type?: DocumentType;
}

type DocumentDto = {
  id: number;
  name?: string | null;
  fileName?: string | null;
  signed?: boolean | null;
  type?: unknown; // ✅ tratează ca unknown, backend poate trimite string/null/etc
};

const DOCS_PAGE_SIZE = 3;
const ROW_HEIGHT = 30;

const statusColor = (status: DocStatus) => {
  switch (status) {
    case "signed":
      return "#2E7152";
    case "unsigned":
    default:
      return "#C0965E";
  }
};

const actionIconSx = {
  color: "#6f7688",
  p: 0.4,
  "&:hover": {
    backgroundColor: "transparent",
    color: "#3D3C42",
  },
  "&:focus, &:active, &:focus-visible, &.Mui-focusVisible": {
    outline: "none",
    backgroundColor: "transparent",
    boxShadow: "none",
  },
} as const;

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

// ✅ type guard/converter: unknown -> DocumentType | undefined
function asDocumentType(v: unknown): DocumentType | undefined {
  if (typeof v !== "string") return undefined;
  const upper = v.toUpperCase();
  return upper === "CV" || upper === "OTHER" ? (upper as DocumentType) : undefined;
}

const UserDetails: React.FC<UserDetailsProps> = ({ user, onBackToStats, onRemoveUser }) => {
  const token = useMemo(() => localStorage.getItem("token"), []);

  const [documents, setDocuments] = useState<UserDocument[]>([]);
  const [loadingDocs, setLoadingDocs] = useState(false);
  const [docsError, setDocsError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"newest" | "oldest" | "signed" | "unsigned">("newest");
  const [page, setPage] = useState(1);

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] =
    useState<"success" | "info" | "error">("success");

  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
  const [deleteDocDialogOpen, setDeleteDocDialogOpen] = useState(false);
  const [docToDelete, setDocToDelete] = useState<UserDocument | null>(null);

  const [documentName, setDocumentName] = useState<string>("");

  const openSnackbar = (message: string, severity: "success" | "info" | "error" = "success") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = (_?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
  };

  // --- API helpers ---
  async function fetchUserDocuments(profileId: string, signal?: AbortSignal) {
    if (!token) {
      setDocuments([]);
      setDocsError("Not authenticated (missing token).");
      return;
    }

    setLoadingDocs(true);
    setDocsError(null);

    try {
      const res = await fetch(`${BASE_URL}/documents?uploaderId=${profileId}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
        signal,
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(`Failed to load documents (${res.status}). ${txt}`);
      }

      const data: unknown = await res.json();
      const list: DocumentDto[] = Array.isArray(data) ? (data as DocumentDto[]) : [];

      const mapped: UserDocument[] = list
        .map((d) => {
          const signed = Boolean(d?.signed);
          const status: DocStatus = signed ? "signed" : "unsigned";

          const type = asDocumentType(d?.type);

          return {
            id: Number(d?.id),
            file: String(d?.name ?? d?.fileName ?? "-"),
            signed,
            status,
            type,
          };
        })
        .filter((doc) => doc.type !== "CV");

      setDocuments(mapped);
      setPage(1);
    } catch (e: unknown) {
      if (e instanceof DOMException && e.name === "AbortError") return;
      setDocuments([]);
      setDocsError(e instanceof Error ? e.message : "Failed to load documents.");
    } finally {
      setLoadingDocs(false);
    }
  }

  async function deleteDocument(documentId: number) {
    if (!token) {
      openSnackbar("Not authenticated (missing token).", "error");
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/documents/${documentId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(`Failed to delete document (${res.status}). ${txt}`);
      }

      setDocuments((prev) => prev.filter((d) => d.id !== documentId));
      openSnackbar("Document deleted.", "success");
    } catch (e: unknown) {
      openSnackbar(e instanceof Error ? e.message : "Failed to delete document.", "error");
    }
  }

  async function patchDocumentSigned(documentId: number, signed: boolean) {
    if (!token) {
      openSnackbar("Not authenticated (missing token).", "error");
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/documents/${documentId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ signed }),
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(`Failed to update document (${res.status}). ${txt}`);
      }

      setDocuments((prev) =>
        prev.map((doc) =>
          doc.id === documentId
            ? { ...doc, signed, status: signed ? "signed" : "unsigned" }
            : doc
        )
      );

      openSnackbar(
        signed ? "Document marked as Signed." : "Document marked as Unsigned.",
        "success"
      );
    } catch (e: unknown) {
      openSnackbar(e instanceof Error ? e.message : "Failed to update document.", "error");
    }
  }

  async function uploadDocumentForUser(profileId: string, file: File) {
    if (!token) {
      openSnackbar("Not authenticated (missing token).", "error");
      return;
    }
    if (!documentName.trim()) {
      openSnackbar("Document name is required.", "error");
      return;
    }

    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("name", documentName.trim());
      // dacă ai și type opțional, îl poți adăuga aici când vei avea UI:
      // form.append("type", selectedType ?? "OTHER");

      const res = await fetch(`${BASE_URL}/documents/upload?uploaderId=${profileId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(`Upload failed (${res.status}). ${txt}`);
      }

      openSnackbar("Document uploaded successfully.", "success");
      setUploadedFile(null);
      setDocumentName("");

      await fetchUserDocuments(profileId);
    } catch (e: unknown) {
      openSnackbar(e instanceof Error ? e.message : "Upload failed.", "error");
    } finally {
      setUploading(false);
    }
  }

  useEffect(() => {
    const controller = new AbortController();
    fetchUserDocuments(user.id, controller.signal);
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.id]);

  // --- filtering/sorting/paging ---
  const filteredDocs = documents.filter((doc) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return doc.file.toLowerCase().includes(q);
  });

  let sortedDocs = [...filteredDocs];
  if (sort === "newest") {
    sortedDocs = sortedDocs.reverse();
  } else if (sort === "signed") {
    sortedDocs = sortedDocs.filter((doc) => doc.signed);
  } else if (sort === "unsigned") {
    sortedDocs = sortedDocs.filter((doc) => !doc.signed);
  }

  const total = sortedDocs.length;
  const pageCount = Math.ceil(total / DOCS_PAGE_SIZE) || 1;
  const safePage = Math.min(page, pageCount);

  const docsToShow = sortedDocs.slice((safePage - 1) * DOCS_PAGE_SIZE, safePage * DOCS_PAGE_SIZE);

  const startIdx = total === 0 ? 0 : (safePage - 1) * DOCS_PAGE_SIZE + 1;
  const endIdx = Math.min(safePage * DOCS_PAGE_SIZE, total);

  const hasResults = docsToShow.length > 0;
  const emptyRows = hasResults
    ? Math.max(0, DOCS_PAGE_SIZE - docsToShow.length)
    : Math.max(0, DOCS_PAGE_SIZE - 1);

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setUploadedFile(file);
  };

  const handleRemoveUserClick = () => setRemoveDialogOpen(true);

  const handleConfirmRemove = async () => {
    try {
      setRemoveDialogOpen(false);

      if (!onRemoveUser) {
        openSnackbar("Remove handler not connected.", "error");
        return;
      }

      await onRemoveUser(user.id);

      openSnackbar(`${user.firstName} ${user.lastName} was removed from your organization`, "success");
    } catch (e: unknown) {
      openSnackbar(e instanceof Error ? e.message : "Failed to remove user.", "error");
    }
  };

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
      {onBackToStats && (
        <Box sx={{ mb: 1, display: "flex", justifyContent: "flex-start" }}>
          <Button
            onClick={onBackToStats}
            startIcon={<ArrowBackIosNewIcon sx={{ fontSize: 14 }} />}
            sx={{
              textTransform: "none",
              color: "#67728A",
              fontWeight: 500,
              fontSize: "0.9rem",
              px: 0,
              "&:hover": { backgroundColor: "transparent", color: "#3D3C42" },
              "&:focus": { outline: "none" },
            }}
          >
            Back to statistics
          </Button>
        </Box>
      )}

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          mb: 3,
        }}
      >
        <Box>
          <Typography
            variant="h6"
            sx={{
              color: "#222",
              fontWeight: 700,
              textAlign: "left",
              mb: 0.5,
              fontSize: { xs: "1.3rem", sm: "1.5rem" },
            }}
          >
            {user.firstName} {user.lastName}
          </Typography>
          <Typography
            variant="subtitle2"
            sx={{
              color: "#7b8bb2",
              fontWeight: 500,
              mt: 0.5,
              textAlign: "left",
            }}
          >
            {user.role
              ? user.role.charAt(0).toUpperCase() + user.role.slice(1).toLowerCase()
              : "Role"}{" "}
            | {user.organization || "Organization name"}
          </Typography>
        </Box>

        <Button
          variant="contained"
          onClick={handleRemoveUserClick}
          sx={{
            alignSelf: "center",
            textTransform: "none",
            borderRadius: 2,
            px: 2,
            py: 0.4,
            bgcolor: "#A71818",
            boxShadow: "none",
            fontWeight: 600,
            fontSize: "0.8rem",
            "&:hover": {
              bgcolor: "#871414",
              boxShadow: "none",
            },
            "&:focus, &:active, &:focus-visible, &.Mui-focusVisible": {
              outline: "none",
              boxShadow: "none",
            },
          }}
        >
          Remove user
        </Button>
      </Box>

      {/* Documents header */}
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
        <Typography variant="h6" sx={{ fontWeight: 700, color: "#222", textAlign: "left" }}>
          Documents
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
              setSort(e.target.value as "newest" | "oldest" | "signed" | "unsigned");
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
                <b style={{ color: "#222" }}>
                  {selected === "oldest" && "Oldest"}
                  {selected === "newest" && "Newest"}
                  {selected === "signed" && "Signed"}
                  {selected === "unsigned" && "Unsigned"}
                </b>
              </span>
            )}
          >
            <MenuItem value="newest" sx={{ fontSize: "0.85rem", py: 0.5 }}>
              <b style={{ color: "#222" }}>Newest</b>
            </MenuItem>
            <MenuItem value="oldest" sx={{ fontSize: "0.85rem", py: 0.5 }}>
              <b style={{ color: "#222" }}>Oldest</b>
            </MenuItem>
            <MenuItem value="signed" sx={{ fontSize: "0.85rem", py: 0.5 }}>
              <b style={{ color: "#222" }}>Signed</b>
            </MenuItem>
            <MenuItem value="unsigned" sx={{ fontSize: "0.85rem", py: 0.5 }}>
              <b style={{ color: "#222" }}>Unsigned</b>
            </MenuItem>
          </Select>
        </Box>
      </Box>

      {/* Documents table */}
      <Box sx={{ flex: 1, minHeight: 0, mb: 2 }}>
        {docsError && (
          <Box sx={{ mb: 1 }}>
            <Typography sx={{ color: "#d32f2f", fontWeight: 600, fontSize: "0.9rem" }}>
              {docsError}
            </Typography>
          </Box>
        )}

        <Box sx={{ overflowX: "auto" }}>
          <Table sx={{ tableLayout: "fixed", width: "100%", borderCollapse: "collapse" }}>
            <TableHead>
              <TableRow sx={{ "& th": { py: 0.8 } }}>
                <TableCell sx={{ ...headCellSx, width: "55%" }}>File</TableCell>
                <TableCell sx={{ ...headCellSx, width: "20%" }}>Status</TableCell>
                <TableCell sx={{ ...headCellSx, width: "25%" }}>Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {loadingDocs ? (
                <TableRow sx={{ height: ROW_HEIGHT }}>
                  <TableCell colSpan={3} sx={{ ...bodyCellSx, borderBottom: "none" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <CircularProgress size={16} />
                      <Typography sx={{ color: "#7b8bb2", fontWeight: 500, fontSize: "0.9rem" }}>
                        Loading documents...
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : hasResults ? (
                <>
                  {docsToShow.map((doc) => (
                    <TableRow key={doc.id} sx={{ height: ROW_HEIGHT, "& td": { py: 0.8 } }}>
                      <TableCell
                        sx={{
                          ...bodyCellSx,
                          color: "#67728A",
                          fontWeight: 500,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {doc.file}
                      </TableCell>

                      <TableCell sx={{ ...bodyCellSx, fontWeight: 500, color: statusColor(doc.status) }}>
                        {doc.signed ? "Signed" : "Unsigned"}
                      </TableCell>

                      <TableCell sx={{ ...bodyCellSx, color: "#222", whiteSpace: "nowrap" }}>
                        {/* Download */}
                        <Tooltip title="Download file" arrow>
                          <IconButton
                            size="small"
                            disableRipple
                            sx={{ ...actionIconSx, mr: 0.75 }}
                            onClick={async () => {
                              try {
                                const t = localStorage.getItem("token");
                                if (!t) {
                                  openSnackbar("Not authenticated (missing token).", "error");
                                  return;
                                }
                                await downloadDocumentWithAuth(doc.id, t, doc.file);
                              } catch (e: unknown) {
                                openSnackbar(e instanceof Error ? e.message : "Download failed.", "error");
                              }
                            }}
                          >
                            <CloudDownloadOutlinedIcon fontSize="inherit" />
                          </IconButton>
                        </Tooltip>

                        {/* Accept => signed true */}
                        <Tooltip title="Accept document" arrow>
                          <IconButton
                            size="small"
                            disableRipple
                            sx={{ ...actionIconSx, mr: 0.75 }}
                            onClick={() => patchDocumentSigned(doc.id, true)}
                          >
                            <CheckCircleOutlineIcon fontSize="inherit" />
                          </IconButton>
                        </Tooltip>

                        {/* Mark as unsigned */}
                        <Tooltip title="Mark as unsigned" arrow>
                          <IconButton
                            size="small"
                            disableRipple
                            sx={{ ...actionIconSx, mr: 0.75 }}
                            onClick={() => patchDocumentSigned(doc.id, false)}
                          >
                            <DoNotDisturbOnOutlinedIcon fontSize="inherit" />
                          </IconButton>
                        </Tooltip>

                        {/* Delete document */}
                        <Tooltip title="Delete document" arrow>
                          <IconButton
                            size="small"
                            disableRipple
                            sx={actionIconSx}
                            onClick={() => {
                              setDocToDelete(doc);
                              setDeleteDocDialogOpen(true);
                            }}
                          >
                            <DeleteOutlineIcon fontSize="inherit" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}

                  {emptyRows > 0 &&
                    Array.from({ length: emptyRows }).map((_, idx) => (
                      <TableRow
                        key={`empty-${idx}`}
                        sx={{
                          height: ROW_HEIGHT,
                          "& td": { py: 0.8, borderBottom: "none !important" },
                        }}
                      >
                        <TableCell
                          colSpan={3}
                          sx={{
                            px: 1.25,
                            fontSize: "0.8rem",
                            color: "transparent",
                            borderBottom: "none !important",
                          }}
                        >
                          &nbsp;
                        </TableCell>
                      </TableRow>
                    ))}
                </>
              ) : (
                <>
                  <TableRow sx={{ height: ROW_HEIGHT, "& td": { py: 0.8 } }}>
                    <TableCell colSpan={3} sx={{ ...bodyCellSx, textAlign: "center", borderBottom: "none" }}>
                      <Typography sx={{ color: "#b5b7c0", fontWeight: 500, fontSize: "0.9rem" }}>
                        No results...
                      </Typography>
                    </TableCell>
                  </TableRow>
                  {emptyRows > 0 &&
                    Array.from({ length: emptyRows }).map((_, idx) => (
                      <TableRow
                        key={`empty-nores-${idx}`}
                        sx={{
                          height: ROW_HEIGHT,
                          "& td": { py: 0.8, borderBottom: "none !important" },
                        }}
                      >
                        <TableCell
                          colSpan={3}
                          sx={{
                            px: 1.25,
                            fontSize: "0.8rem",
                            color: "transparent",
                            borderBottom: "none !important",
                          }}
                        >
                          &nbsp;
                        </TableCell>
                      </TableRow>
                    ))}
                </>
              )}
            </TableBody>
          </Table>
        </Box>

        {/* Pagination */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mt: 1.5,
            flexWrap: "wrap",
            width: "100%",
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="body2"
              sx={{
                color: "#B5B7C0",
                fontWeight: 500,
                textAlign: "left",
                fontSize: "0.75rem",
              }}
            >
              {total === 0
                ? "Showing data 0 of 0 entries"
                : `Showing data ${startIdx} to ${endIdx} of ${total} entries`}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Pagination
              count={pageCount}
              page={safePage}
              onChange={handlePageChange}
              siblingCount={1}
              boundaryCount={1}
              color="primary"
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
                "& .MuiPaginationItem-root:focus, & .MuiPaginationItem-root.Mui-focusVisible": {
                  outline: "none !important",
                  boxShadow: "none !important",
                },
                "& .Mui-selected": {
                  backgroundColor: "#67728A !important",
                  color: "#fff !important",
                  borderColor: "#67728A !important",
                  borderWidth: "1.5px",
                  borderStyle: "solid",
                  outline: "none !important",
                },
                "& .Mui-selected:hover": {
                  backgroundColor: "#5a6276 !important",
                },
              }}
              showFirstButton={false}
              showLastButton={false}
            />
          </Box>
        </Box>
      </Box>

      {/* Assign new document */}
      <Box sx={{ mt: 0.5 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: "#222", textAlign: "left", mb: 1.25 }}>
          Assign new document
        </Typography>

        <Box sx={{ mb: 1.25 }}>
          <Typography variant="body2" sx={{ fontWeight: 500, color: "#4b5563", textAlign: "left", mb: 0.4 }}>
            Document name
          </Typography>

          <input
            type="text"
            value={documentName}
            onChange={(e) => setDocumentName(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "8px 12px",
              borderRadius: "6px",
              border: "1.5px solid #dde3f0",
              backgroundColor: "#f4f6fb",
              fontSize: "0.8rem",
              color: "#67728A",
              marginBottom: "12px",
              outline: "none",
              boxSizing: "border-box",
            }}
            placeholder="Enter document name"
          />

          <Typography variant="body2" sx={{ fontWeight: 500, color: "#4b5563", textAlign: "left", mb: 0.4 }}>
            Upload file
          </Typography>

          <Box
            component="label"
            htmlFor="user-doc-upload"
            sx={{
              borderRadius: 3,
              bgcolor: "#f4f6fb",
              border: "2px dashed #dde3f0",
              height: 70,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              cursor: "pointer",
            }}
          >
            <CloudUploadOutlinedIcon sx={{ fontSize: 26, color: "#67728A" }} />
            <Typography variant="body2" sx={{ mt: 0.4, color: "#67728A", fontSize: "0.8rem" }}>
              {uploadedFile ? "Click to change the file" : "Click to upload a file"}
            </Typography>
            <input
              id="user-doc-upload"
              type="file"
              style={{ display: "none" }}
              onChange={handleFileChange}
              accept=".pdf"
            />
          </Box>

          {uploadedFile && (
            <Box sx={{ mt: 0.6, display: "flex", alignItems: "center", justifyContent: "flex-start", gap: 1 }}>
              <Typography
                variant="body2"
                sx={{
                  color: "#4b5563",
                  fontSize: "0.8rem",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  textAlign: "left",
                  flex: 1,
                }}
              >
                Selected file: {uploadedFile.name}
              </Typography>
              <Button
                size="small"
                variant="text"
                onClick={() => setUploadedFile(null)}
                sx={{
                  textTransform: "none",
                  fontSize: "0.75rem",
                  color: "#A71818",
                  minWidth: "auto",
                  px: 0.5,
                  "&:hover": { backgroundColor: "transparent", color: "#871414" },
                  "&:focus, &:active, &:focus-visible, &.Mui-focusVisible": {
                    outline: "none",
                    boxShadow: "none",
                  },
                }}
              >
                Remove file
              </Button>
            </Box>
          )}
        </Box>

        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 0.5 }}>
          <Button
            variant="contained"
            disabled={!uploadedFile || uploading || !documentName.trim()}
            onClick={() => {
              if (!uploadedFile) {
                openSnackbar("Please choose a file.", "error");
                return;
              }
              uploadDocumentForUser(user.id, uploadedFile);
            }}
            sx={{
              textTransform: "none",
              borderRadius: 3,
              px: 3,
              py: 0.8,
              bgcolor: "#6f7688",
              boxShadow: "none",
              fontWeight: 500,
              fontSize: "0.95rem",
              "&:hover": { bgcolor: "#3D3C42", boxShadow: "none" },
              "&:focus, &:active, &:focus-visible, &.Mui-focusVisible": { outline: "none", boxShadow: "none" },
              "&.Mui-disabled": { bgcolor: "#c9ceda", color: "#ffffff" },
            }}
          >
            {uploading ? "Assigning..." : "Assign document"}
          </Button>
        </Box>
      </Box>

      {/* Remove user dialog */}
      <Dialog
        open={removeDialogOpen}
        onClose={() => setRemoveDialogOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 2.5,
            boxShadow: "0 8px 24px rgba(15, 23, 42, 0.15)",
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, fontSize: "1.05rem", color: "#111827", pb: 1 }}>
          Remove user
        </DialogTitle>
        <DialogContent sx={{ pt: 0 }}>
          <Typography sx={{ mt: 0.5, color: "#4b5563", fontSize: "0.9rem" }}>
            Are you sure you want to exclude{" "}
            <strong>
              {user.firstName} {user.lastName}
            </strong>{" "}
            from your organization?
          </Typography>
          <Box sx={{ mt: 1.5, p: 1, borderRadius: 2, bgcolor: "#fef2f2", border: "1px solid #fee2e2" }}>
            <Typography variant="body2" sx={{ color: "#991b1b", fontSize: "0.78rem" }}>
              This action cannot be undone.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ pt: 1.5, pb: 0.5, px: 1, justifyContent: "flex-end", gap: 1 }}>
          <Button
            onClick={() => setRemoveDialogOpen(false)}
            variant="outlined"
            sx={{
              textTransform: "none",
              borderRadius: 2,
              px: 2.5,
              fontSize: "0.85rem",
              borderColor: "#dde3f0",
              color: "#4b5563",
              "&:hover": { borderColor: "#cbd5e1", backgroundColor: "#f8fafc" },
              "&:focus, &:active, &:focus-visible, &.Mui-focusVisible": { outline: "none", boxShadow: "none" },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmRemove}
            variant="contained"
            color="error"
            sx={{
              textTransform: "none",
              borderRadius: 2,
              px: 2.8,
              fontSize: "0.85rem",
              bgcolor: "#A71818",
              boxShadow: "none",
              "&:hover": { bgcolor: "#871414", boxShadow: "none" },
              "&:focus, &:active, &:focus-visible, &.Mui-focusVisible": { outline: "none", boxShadow: "none" },
            }}
          >
            Remove
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete doc dialog */}
      <Dialog
        open={deleteDocDialogOpen}
        onClose={() => {
          setDeleteDocDialogOpen(false);
          setDocToDelete(null);
        }}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 2.5,
            boxShadow: "0 8px 24px rgba(15, 23, 42, 0.15)",
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, fontSize: "1.05rem", color: "#111827", pb: 1 }}>
          Delete document
        </DialogTitle>

        <DialogContent sx={{ pt: 0 }}>
          <Typography sx={{ mt: 0.5, color: "#4b5563", fontSize: "0.9rem" }}>
            Are you sure you want to delete <strong>{docToDelete?.file ?? "this document"}</strong>?
          </Typography>

          <Box sx={{ mt: 1.5, p: 1, borderRadius: 2, bgcolor: "#fef2f2", border: "1px solid #fee2e2" }}>
            <Typography variant="body2" sx={{ color: "#991b1b", fontSize: "0.78rem" }}>
              This action cannot be undone.
            </Typography>
          </Box>
        </DialogContent>

        <DialogActions sx={{ pt: 1.5, pb: 0.5, px: 1, justifyContent: "flex-end", gap: 1 }}>
          <Button
            onClick={() => {
              setDeleteDocDialogOpen(false);
              setDocToDelete(null);
            }}
            variant="outlined"
            sx={{
              textTransform: "none",
              borderRadius: 2,
              px: 2.5,
              fontSize: "0.85rem",
              borderColor: "#dde3f0",
              color: "#4b5563",
              "&:hover": { borderColor: "#cbd5e1", backgroundColor: "#f8fafc" },
            }}
          >
            Cancel
          </Button>

          <Button
            onClick={async () => {
              if (!docToDelete) return;
              const id = docToDelete.id;
              setDeleteDocDialogOpen(false);
              setDocToDelete(null);
              await deleteDocument(id);
            }}
            variant="contained"
            color="error"
            sx={{
              textTransform: "none",
              borderRadius: 2,
              px: 2.8,
              fontSize: "0.85rem",
              bgcolor: "#A71818",
              boxShadow: "none",
              "&:hover": { bgcolor: "#871414", boxShadow: "none" },
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default UserDetails;
