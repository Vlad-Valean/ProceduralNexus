import React, { useState } from "react";
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
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloudDownloadOutlinedIcon from "@mui/icons-material/CloudDownloadOutlined";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

interface UserDetailsProps {
  user: {
    firstName: string;
    lastName: string;
    email: string;
    role?: string;
    organization?: string;
  };
  onBackToStats?: () => void;
}

type DocStatus = "completed" | "pending" | "review";

interface UserDocument {
  id: number;
  name: string;
  file: string;
  status: DocStatus;
}

const BASE_DOCS: UserDocument[] = [
  { id: 1, name: "Identity card", file: "ID_card.pdf", status: "completed" },
  { id: 2, name: "CV", file: "resume.pdf", status: "completed" },
  { id: 3, name: "Bank account", file: "-", status: "pending" },
  {
    id: 4,
    name: "Employment contract",
    file: "contract.pdf",
    status: "review",
  },
];

const ALL_DOCS: UserDocument[] = Array.from({ length: 8 }).map((_, idx) => {
  const base = BASE_DOCS[idx % BASE_DOCS.length];
  return { ...base, id: idx + 1 };
});

const DOCS_PAGE_SIZE = 3;

// fixed row height
const ROW_HEIGHT = 30;

// dummy pdf to open in a new tab
const SAMPLE_DOC_URL =
  "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";

const statusColor = (status: DocStatus) => {
  switch (status) {
    case "completed":
      return "#2E7152";
    case "pending":
      return "#C0965E";
    case "review":
    default:
      return "#586AA2";
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

// shared cell padding so columns are closer together
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

const UserDetails: React.FC<UserDetailsProps> = ({ user, onBackToStats }) => {
  const [documents, setDocuments] = useState<UserDocument[]>(ALL_DOCS);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"newest" | "oldest">("newest");
  const [page, setPage] = useState(1);

  const [docName, setDocName] = useState("");
  const [docNameError, setDocNameError] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] =
    useState<"success" | "info" | "error">("success");

  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);

  // --- filter & sort documents (search only in name + file) ---
  let filteredDocs = documents.filter((doc) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      doc.name.toLowerCase().includes(q) ||
      doc.file.toLowerCase().includes(q)
    );
  });

  if (sort === "newest") {
    filteredDocs = [...filteredDocs].reverse();
  }

  const total = filteredDocs.length;
  const pageCount = Math.ceil(total / DOCS_PAGE_SIZE) || 1;
  const safePage = Math.min(page, pageCount);

  const docsToShow = filteredDocs.slice(
    (safePage - 1) * DOCS_PAGE_SIZE,
    safePage * DOCS_PAGE_SIZE
  );

  const startIdx = total === 0 ? 0 : (safePage - 1) * DOCS_PAGE_SIZE + 1;
  const endIdx = Math.min(safePage * DOCS_PAGE_SIZE, total);

  const hasResults = docsToShow.length > 0;

  const emptyRows = hasResults
    ? Math.max(0, DOCS_PAGE_SIZE - docsToShow.length)
    : Math.max(0, DOCS_PAGE_SIZE - 1); // 1 row reserved for "No results..."

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const openSnackbar = (
    message: string,
    severity: "success" | "info" | "error" = "success"
  ) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleAssignDocument = () => {
    if (!docName.trim()) {
      setDocNameError("Document name is required*");
      return;
    }
    setDocNameError("");

    const newDoc: UserDocument = {
      id: documents.length + 1,
      name: docName.trim(),
      file: uploadedFile ? uploadedFile.name : "-",
      status: "pending",
    };

    setDocuments((prev) => [...prev, newDoc]);
    setDocName("");
    setUploadedFile(null);
    openSnackbar("Document assigned successfully", "success");
  };

  const updateStatus = (id: number, status: DocStatus) => {
    setDocuments((prev) =>
      prev.map((doc) => (doc.id === id ? { ...doc, status } : doc))
    );
  };

  const handleRemoveUserClick = () => {
    setRemoveDialogOpen(true);
  };

  const handleConfirmRemove = () => {
    setRemoveDialogOpen(false);
    openSnackbar(
      `${user.firstName} ${user.lastName} was removed from your organization`,
      "info"
    );
  };

  const handleSnackbarClose = (
    _?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
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
      {/* Back to statistics button (top row) */}
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
            {user.role || "Role"} | {user.organization || "Organization name"}
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

      {/* DOCUMENTS SECTION TITLE + SEARCH + SORT */}
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
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            color: "#222",
            textAlign: "left",
          }}
        >
          Documents
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
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
              setSort(e.target.value as "newest" | "oldest");
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
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "#dde3f0 !important",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "#cfd6e6 !important",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "#a5b1c8 !important",
              },
            }}
            renderValue={(selected) => (
              <span>
                <span style={{ color: "#7E7E7E" }}>Sort by : </span>
                <b style={{ color: "#222" }}>
                  {selected === "oldest" ? "Oldest" : "Newest"}
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
          </Select>
        </Box>
      </Box>

      {/* TABLE + FOOTER */}
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          mb: 2,
        }}
      >
        <Box sx={{ overflowX: "auto" }}>
          <Table
            sx={{
              tableLayout: "fixed", // fixed columns
              width: "100%",        // fit the card width
              borderCollapse: "collapse",
            }}
          >
            <TableHead>
              <TableRow sx={{ "& th": { py: 0.8 } }}>
                <TableCell sx={{ ...headCellSx, width: "35%" }}>Name</TableCell>
                <TableCell sx={{ ...headCellSx, width: "25%" }}>File</TableCell>
                <TableCell sx={{ ...headCellSx, width: "15%" }}>
                  Status
                </TableCell>
                <TableCell sx={{ ...headCellSx, width: "25%" }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {hasResults ? (
                <>
                  {docsToShow.map((doc) => (
                    <TableRow
                      key={doc.id}
                      sx={{ height: ROW_HEIGHT, "& td": { py: 0.8 } }}
                    >
                      <TableCell
                        sx={{
                          ...bodyCellSx,
                          color: "#222",
                          fontWeight: 500,
                        }}
                      >
                        {doc.name}
                      </TableCell>
                      <TableCell
                        sx={{
                          ...bodyCellSx,
                          color: doc.file === "-" ? "#b5b7c0" : "#67728A",
                          fontWeight: 500,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {doc.file}
                      </TableCell>
                      <TableCell
                        sx={{
                          ...bodyCellSx,
                          fontWeight: 500,
                          color: statusColor(doc.status),
                        }}
                      >
                        {doc.status === "completed"
                          ? "Completed"
                          : doc.status === "pending"
                          ? "Pending..."
                          : "In review"}
                      </TableCell>
                      <TableCell
                        sx={{
                          ...bodyCellSx,
                          color: "#222",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {doc.file !== "-" && (
                          <>
                            <Tooltip title="Download file" arrow>
                              <IconButton
                                component="a"
                                href={SAMPLE_DOC_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                size="small"
                                disableRipple
                                sx={{ ...actionIconSx, mr: 0.75 }}
                              >
                                <CloudDownloadOutlinedIcon fontSize="inherit" />
                              </IconButton>
                            </Tooltip>

                            {doc.status === "review" && (
                              <>
                                <Tooltip title="Accept document" arrow>
                                  <IconButton
                                    size="small"
                                    disableRipple
                                    sx={{ ...actionIconSx, mr: 0.75 }}
                                    onClick={() =>
                                      updateStatus(doc.id, "completed")
                                    }
                                  >
                                    <CheckCircleOutlineIcon fontSize="inherit" />
                                  </IconButton>
                                </Tooltip>

                                <Tooltip title="Request changes for document" arrow>
                                  <IconButton
                                    size="small"
                                    disableRipple
                                    sx={actionIconSx}
                                    onClick={() =>
                                      updateStatus(doc.id, "pending")
                                    }
                                  >
                                    <CloseOutlinedIcon fontSize="inherit" />
                                  </IconButton>
                                </Tooltip>
                              </>
                            )}
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}

                  {/* empty rows so container height stays stable */}
                  {emptyRows > 0 &&
                    Array.from({ length: emptyRows }).map((_, idx) => (
                      <TableRow
                        key={`empty-${idx}`}
                        sx={{
                          height: ROW_HEIGHT,
                          "& td": {
                            py: 0.8,
                            borderBottom: "none !important",
                          },
                        }}
                      >
                        <TableCell
                          colSpan={4}
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
                  {/* No results row – same height as normal rows */}
                  <TableRow
                    sx={{
                      height: ROW_HEIGHT,
                      "& td": { py: 0.8 },
                    }}
                  >
                    <TableCell
                      colSpan={4}
                      sx={{
                        ...bodyCellSx,
                        textAlign: "center",
                      }}
                    >
                      <Typography
                        sx={{
                          color: "#b5b7c0",
                          fontWeight: 500,
                          fontSize: "0.9rem",
                        }}
                      >
                        No results...
                      </Typography>
                    </TableCell>
                  </TableRow>

                  {/* filler rows, same height as others */}
                  {emptyRows > 0 &&
                    Array.from({ length: emptyRows }).map((_, idx) => (
                      <TableRow
                        key={`empty-nores-${idx}`}
                        sx={{
                          height: ROW_HEIGHT,
                          "& td": {
                            py: 0.8,
                            borderBottom: "none !important",
                          },
                        }}
                      >
                        <TableCell
                          colSpan={4}
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

        {/* Footer under table (text + pagination) */}
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
                "& .MuiPaginationItem-root:focus, & .MuiPaginationItem-root.Mui-focusVisible":
                  {
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

      {/* ASSIGN NEW DOCUMENT SECTION */}
      <Box sx={{ mt: 0.5 }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            color: "#222",
            textAlign: "left",
            mb: 1.25,
          }}
        >
          Assign new document
        </Typography>

        {/* Document name row + error on same line */}
        <Box sx={{ mb: 0.75 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 0.4,
            }}
          >
            <Typography
              variant="body2"
              sx={{
                fontWeight: 500,
                color: "#4b5563",
                textAlign: "left",
              }}
            >
              Document name
            </Typography>
            {docNameError && (
              <Typography
                variant="caption"
                sx={{ color: "#d32f2f", fontWeight: 500 }}
              >
                {docNameError}
              </Typography>
            )}
          </Box>

          <TextField
            fullWidth
            placeholder="Enter text..."
            size="small"
            value={docName}
            onChange={(e) => {
              setDocName(e.target.value);
              if (docNameError) setDocNameError("");
            }}
            error={!!docNameError}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 3,
                bgcolor: "#f4f6fb",
                height: 44,
                "& fieldset": { borderColor: "#dde3f0" },
                "&:hover fieldset": { borderColor: "#cfd6e6" },
                "&.Mui-focused fieldset": { borderColor: "#a5b1c8" },
              },
            }}
          />
        </Box>

        {/* Upload field */}
        <Box sx={{ mb: 1.25 }}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 500,
              color: "#4b5563",
              textAlign: "left",
              mb: 0.4,
            }}
          >
            Upload file (optional)
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
            <Typography
              variant="body2"
              sx={{ mt: 0.4, color: "#67728A", fontSize: "0.8rem" }}
            >
              {uploadedFile
                ? "Click to change the file"
                : "Click to upload a file"}
            </Typography>
            <input
              id="user-doc-upload"
              type="file"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
          </Box>

          {uploadedFile && (
            <Box
              sx={{
                mt: 0.6,
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                gap: 1,
                width: "100%",
              }}
            >
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
                  "&:hover": {
                    backgroundColor: "transparent",
                    color: "#871414",
                  },
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

        {/* Assign button */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            mt: 0.5,
          }}
        >
          <Button
            variant="contained"
            onClick={handleAssignDocument}
            sx={{
              textTransform: "none",
              borderRadius: 3,
              px: 3,
              py: 0.8,
              bgcolor: "#6f7688",
              boxShadow: "none",
              fontWeight: 500,
              fontSize: "0.95rem",
              "&:hover": {
                bgcolor: "#3D3C42",
                boxShadow: "none",
              },
              "&:focus, &:active, &:focus-visible, &.Mui-focusVisible": {
                outline: "none",
                boxShadow: "none",
              },
            }}
          >
            Assign document
          </Button>
        </Box>
      </Box>

      {/* Remove user confirmation dialog */}
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
        <DialogTitle
          sx={{
            fontWeight: 700,
            fontSize: "1.05rem",
            color: "#111827",
            pb: 1,
          }}
        >
          Remove user
        </DialogTitle>
        <DialogContent sx={{ pt: 0 }}>
          <Typography
            sx={{
              mt: 0.5,
              color: "#4b5563",
              fontSize: "0.9rem",
            }}
          >
            Are you sure you want to exclude{" "}
            <strong>
              {user.firstName} {user.lastName}
            </strong>{" "}
            from your organization?
          </Typography>
          <Box
            sx={{
              mt: 1.5,
              p: 1,
              borderRadius: 2,
              bgcolor: "#fef2f2",
              border: "1px solid #fee2e2",
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: "#991b1b",
                fontSize: "0.78rem",
              }}
            >
              This action cannot be undone.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions
          sx={{
            pt: 1.5,
            pb: 0.5,
            px: 1,
            justifyContent: "flex-end",
            gap: 1,
          }}
        >
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
              "&:hover": {
                borderColor: "#cbd5e1",
                backgroundColor: "#f8fafc",
              },
              "&:focus, &:active, &:focus-visible, &.Mui-focusVisible": {
                outline: "none",
                boxShadow: "none",
              },
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
            Remove
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for success/info messages */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default UserDetails;
