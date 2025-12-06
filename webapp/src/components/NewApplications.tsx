import React, { useState } from "react";
import {
  Paper,
  Typography,
  Box,
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
  Snackbar,
  Alert,
  Button,
  Tooltip,          
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloudDownloadOutlinedIcon from "@mui/icons-material/CloudDownloadOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

const SAMPLE_PDF_URL =
  "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";

const rawApplications = [
  { firstName: "Henry", lastName: "Baker", email: "henry.baker@example.com", fileName: "Henry_Baker_Resume.pdf", fileUrl: SAMPLE_PDF_URL },
  { firstName: "Charlotte", lastName: "Adams", email: "charlotte.adams@example.com", fileName: "Charlotte_Adams_CV.pdf", fileUrl: SAMPLE_PDF_URL },
  { firstName: "James", lastName: "Green", email: "james.green@example.com", fileName: "James_Green_Resume.pdf", fileUrl: SAMPLE_PDF_URL },
  { firstName: "Isabella", lastName: "Scott", email: "isabella.scott@example.com", fileName: "Isabella_Scott_Transcript.pdf", fileUrl: SAMPLE_PDF_URL },
  { firstName: "Lucas", lastName: "King", email: "lucas.king@example.com", fileName: "Lucas_King_Portfolio.pdf", fileUrl: SAMPLE_PDF_URL },
  { firstName: "Ethan", lastName: "Hernandez", email: "ethan.hernandez@example.com", fileName: "Ethan_Hernandez_CV.pdf", fileUrl: SAMPLE_PDF_URL },
  { firstName: "Mia", lastName: "Young", email: "mia.young@example.com", fileName: "Mia_Young_Resume.pdf", fileUrl: SAMPLE_PDF_URL },
  { firstName: "Ava", lastName: "Allen", email: "ava.allen@example.com", fileName: "Ava_Allen_CoverLetter.pdf", fileUrl: SAMPLE_PDF_URL },
  { firstName: "Noah", lastName: "Hall", email: "noah.hall@example.com", fileName: "Noah_Hall_CV.pdf", fileUrl: SAMPLE_PDF_URL },
  { firstName: "Liam", lastName: "Walker", email: "liam.walker@example.com", fileName: "Liam_Walker_ReferenceLetter.pdf", fileUrl: SAMPLE_PDF_URL },
  { firstName: "Eva", lastName: "Clark", email: "eva.clark@example.com", fileName: "Eva_Clark_CV.pdf", fileUrl: SAMPLE_PDF_URL },
  { firstName: "Maria", lastName: "Brown", email: "maria.brown@example.com", fileName: "Maria_Brown_CV.pdf", fileUrl: SAMPLE_PDF_URL },
  { firstName: "John", lastName: "Smith", email: "john.smith@example.com", fileName: "John_Smith_Resume.pdf", fileUrl: SAMPLE_PDF_URL },
  { firstName: "Alice", lastName: "Johnson", email: "alice.johnson@example.com", fileName: "Alice_Johnson_CoverLetter.pdf", fileUrl: SAMPLE_PDF_URL },
  { firstName: "Bob", lastName: "Williams", email: "bob.williams@example.com", fileName: "Bob_Williams_CV.pdf", fileUrl: SAMPLE_PDF_URL },
  { firstName: "Olivia", lastName: "Moore", email: "olivia.moore@example.com", fileName: "Olivia_Moore_Portfolio.pdf", fileUrl: SAMPLE_PDF_URL },
  { firstName: "David", lastName: "Taylor", email: "david.taylor@example.com", fileName: "David_Taylor_Transcript.pdf", fileUrl: SAMPLE_PDF_URL },
  { firstName: "Sophia", lastName: "Anderson", email: "sophia.anderson@example.com", fileName: "Sophia_Anderson_CV.pdf", fileUrl: SAMPLE_PDF_URL },
  { firstName: "Mark", lastName: "Thomas", email: "mark.thomas@example.com", fileName: "Mark_Thomas_Resume.pdf", fileUrl: SAMPLE_PDF_URL },
  { firstName: "Sara", lastName: "Miller", email: "sara.miller@example.com", fileName: "Sara_Miller_CV.pdf", fileUrl: SAMPLE_PDF_URL },
  { firstName: "Tom", lastName: "Garcia", email: "tom.garcia@example.com", fileName: "Tom_Garcia_Resume.pdf", fileUrl: SAMPLE_PDF_URL },
  { firstName: "Emma", lastName: "Martinez", email: "emma.martinez@example.com", fileName: "Emma_Martinez_CV.pdf", fileUrl: SAMPLE_PDF_URL },
  { firstName: "Chris", lastName: "Wilson", email: "chris.wilson@example.com", fileName: "Chris_Wilson_Resume.pdf", fileUrl: SAMPLE_PDF_URL },
  { firstName: "Jane", lastName: "Cooper", email: "jane.cooper@example.com", fileName: "Jane_Cooper_CV.pdf", fileUrl: SAMPLE_PDF_URL },
];

type RawApp = (typeof rawApplications)[number];
type Application = RawApp & { id: number };

const allApplications: Application[] = rawApplications.map((app, idx) => ({
  id: idx + 1,
  ...app,
}));

const PAGE_SIZE = 11;

interface NewApplicationsProps {
  onBack?: () => void;
}

const NewApplications: React.FC<NewApplicationsProps> = ({ onBack }) => {
  const [applications, setApplications] = useState<Application[]>(allApplications);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] =
    useState<"success" | "info" | "error">("success");

  let filtered = applications.filter((app) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      app.firstName.toLowerCase().includes(q) ||
      app.lastName.toLowerCase().includes(q) ||
      app.email.toLowerCase().includes(q) ||
      app.fileName.toLowerCase().includes(q)
    );
  });

  filtered = [...filtered];
  if (sort === "alpha-asc") {
    filtered.sort((a, b) =>
      (a.firstName + " " + a.lastName)
        .toLowerCase()
        .localeCompare((b.firstName + " " + b.lastName).toLowerCase())
    );
  } else if (sort === "alpha-desc") {
    filtered.sort((a, b) =>
      (b.firstName + " " + b.lastName)
        .toLowerCase()
        .localeCompare((a.firstName + " " + a.lastName).toLowerCase())
    );
  } else if (sort === "newest") {
    filtered.reverse();
  }

  const total = filtered.length;
  const pageCount = Math.ceil(total / PAGE_SIZE) || 1;
  const safePage = Math.min(page, pageCount);

  const apps = filtered.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  );

  const startIdx = total === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1;
  const endIdx = Math.min(safePage * PAGE_SIZE, total);
  const emptyRows = Math.max(0, PAGE_SIZE - apps.length);

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) =>
    setPage(value);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleDecision = (id: number, type: "accept" | "reject") => {
    setApplications((prev) => prev.filter((app) => app.id !== id));
    setSnackbarMessage(
      type === "accept"
        ? "User was added to your organization"
        : "Application was rejected"
    );
    setSnackbarSeverity(type === "accept" ? "success" : "info");
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = (
    _?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
  };

  const actionIconSx = {
    color: "#6f7688",
    p: 0.5,
    "&:hover": {
      backgroundColor: "transparent",
      color: "#3D3C42",
    },
    "&:focus, &:active": {
      outline: "none",
      backgroundColor: "transparent",
      boxShadow: "none",
    },
    "&.Mui-focusVisible": {
      outline: "none",
      backgroundColor: "transparent",
      boxShadow: "none",
    },
  } as const;

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
            "&:focus": { outline: "none" },
          }}
        >
          Back to statistics
        </Button>
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          mb: 2,
          flexWrap: "wrap",
        }}
      >
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="h6"
            sx={{
              color: "#222",
              fontWeight: 700,
              textAlign: "left",
            }}
          >
            New applications
          </Typography>
        </Box>

        <TextField
          placeholder="Search"
          size="small"
          autoComplete="off"
          value={search}
          onChange={handleSearchChange}
          sx={{
            bgcolor: "#f4f6fb",
            borderRadius: 2,
            width: { xs: "100%", sm: 180 },
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              height: 32,
              fontSize: "0.8rem",
              "& fieldset": {
                borderColor: "#dde3f0",
              },
              "&:hover fieldset": {
                borderColor: "#cfd6e6",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#a5b1c8",
              },
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
            setSort(e.target.value);
            setPage(1);
          }}
          size="small"
          sx={{
            bgcolor: "#f4f6fb",
            borderRadius: 2,
            height: 32,
            minWidth: 150,
            fontWeight: 500,
            fontSize: "0.8rem",
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
          renderValue={(selected) => {
            let label = "";
            switch (selected) {
              case "alpha-asc":
                label = "A to Z";
                break;
              case "alpha-desc":
                label = "Z to A";
                break;
              case "oldest":
                label = "Oldest";
                break;
              default:
                label = "Newest";
            }
            return (
              <span>
                <span style={{ color: "#7E7E7E" }}>Sort by : </span>
                <b style={{ color: "#222" }}>{label}</b>
              </span>
            );
          }}
        >
          <MenuItem value="alpha-asc" sx={{ fontSize: "0.8rem", py: 0.5 }}>
            <b style={{ color: "#222" }}>A to Z</b>
          </MenuItem>
          <MenuItem value="alpha-desc" sx={{ fontSize: "0.8rem", py: 0.5 }}>
            <b style={{ color: "#222" }}>Z to A</b>
          </MenuItem>
          <MenuItem value="oldest" sx={{ fontSize: "0.8rem", py: 0.5 }}>
            <b style={{ color: "#222" }}>Oldest</b>
          </MenuItem>
          <MenuItem value="newest" sx={{ fontSize: "0.8rem", py: 0.5 }}>
            <b style={{ color: "#222" }}>Newest</b>
          </MenuItem>
        </Select>
      </Box>

      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          mb: 2,
          overflowX: "auto",
          overflowY: "auto",
        }}
      >
        <Table
          sx={{
            tableLayout: "fixed",
            width: "max-content",
            minWidth: "100%",
            borderCollapse: "collapse",
          }}
        >
          <TableHead>
            <TableRow sx={{ "& th": { py: 1 } }}>
              <TableCell
                sx={{
                  width: 90,
                  minWidth: 80,
                  maxWidth: 90,
                  fontWeight: 500,
                  color: "#B5B7C0",
                  borderBottom: "1px solid #e3e8f2",
                  textAlign: "left",
                  fontSize: "0.8rem",
                  px: 0,
                }}
              >
                First name
              </TableCell>
              <TableCell
                sx={{
                  width: 100,
                  minWidth: 90,
                  maxWidth: 110,
                  fontWeight: 500,
                  color: "#B5B7C0",
                  borderBottom: "1px solid #e3e8f2",
                  textAlign: "left",
                  fontSize: "0.8rem",
                }}
              >
                Last name
              </TableCell>
              <TableCell
                sx={{
                  minWidth: 200,
                  maxWidth: 230,
                  fontWeight: 500,
                  color: "#B5B7C0",
                  borderBottom: "1px solid #e3e8f2",
                  textAlign: "left",
                  fontSize: "0.8rem",
                }}
              >
                Email
              </TableCell>
              <TableCell
                sx={{
                  minWidth: 140,
                  maxWidth: 170,
                  fontWeight: 500,
                  color: "#B5B7C0",
                  borderBottom: "1px solid #e3e8f2",
                  textAlign: "left",
                  fontSize: "0.8rem",
                }}
              >
                File
              </TableCell>
              <TableCell
                sx={{
                  width: 140,
                  minWidth: 120,
                  maxWidth: 150,
                  fontWeight: 500,
                  color: "#B5B7C0",
                  borderBottom: "1px solid #e3e8f2",
                  textAlign: "left",
                  fontSize: "0.8rem",
                }}
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {apps.length > 0 ? (
              <>
                {apps.map((app) => (
                  <TableRow key={app.id} sx={{ "& td": { py: 0.7 } }}>
                    <TableCell
                      sx={{
                        fontSize: "0.8rem",
                        borderBottom: "1px solid #e3e8f2",
                        color: "#222",
                        fontWeight: 500,
                        textAlign: "left",
                        px: 0,
                      }}
                    >
                      {app.firstName}
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: "0.8rem",
                        borderBottom: "1px solid #e3e8f2",
                        color: "#222",
                        fontWeight: 500,
                        textAlign: "left",
                      }}
                    >
                      {app.lastName}
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: "0.8rem",
                        borderBottom: "1px solid #e3e8f2",
                        color: "#222",
                        fontWeight: 500,
                        textAlign: "left",
                      }}
                    >
                      {app.email}
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: "0.8rem",
                        borderBottom: "1px solid #e3e8f2",
                        color: "#67728A",
                        fontWeight: 500,
                        textAlign: "left",
                      }}
                    >
                      {app.fileName}
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: "0.8rem",
                        borderBottom: "1px solid #e3e8f2",
                        color: "#222",
                        textAlign: "left",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 2.5,
                        }}
                      >
                        <Tooltip title="Download file" arrow>
                          <IconButton
                            component="a"
                            href={app.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            download={app.fileName}
                            size="small"
                            disableRipple
                            sx={actionIconSx}
                          >
                            <CloudDownloadOutlinedIcon fontSize="inherit" />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Accept user into organization" arrow>
                          <IconButton
                            size="small"
                            disableRipple
                            sx={actionIconSx}
                            onClick={() => handleDecision(app.id, "accept")}
                          >
                            <CheckCircleOutlineIcon fontSize="inherit" />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Reject user's application" arrow>
                          <IconButton
                            size="small"
                            disableRipple
                            sx={actionIconSx}
                            onClick={() => handleDecision(app.id, "reject")}
                          >
                            <CloseOutlinedIcon fontSize="inherit" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}

                {emptyRows > 0 &&
                  Array.from({ length: emptyRows }).map((_, idx) => (
                    <TableRow
                      key={`empty-${idx}`}
                      sx={{
                        "& td": {
                          py: 0.8,
                          borderBottom: "none !important",
                        },
                      }}
                    >
                      <TableCell
                        colSpan={5}
                        sx={{
                          fontSize: "0.8rem",
                          borderBottom: "none !important",
                          color: "transparent",
                          px: 0,
                        }}
                      >
                        &nbsp;
                      </TableCell>
                    </TableRow>
                  ))}
              </>
            ) : (
              <TableRow>
                <TableCell colSpan={5} sx={{ border: 0, py: 6, px: 0 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      minHeight: 100,
                    }}
                  >
                    <Typography
                      sx={{
                        color: "#b5b7c0",
                        fontWeight: 500,
                        fontSize: "1.2rem",
                      }}
                    >
                      No applications found.
                    </Typography>
                  </Box>
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
          mt: "auto",
          pt: 0.5,
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
              "& .MuiPaginationItem-root:focus": {
                boxShadow: "none !important",
                outline: "none !important",
                borderColor: "#67728A !important",
              },
              "& .MuiPaginationItem-root:active": {
                boxShadow: "none !important",
                outline: "none !important",
                borderColor: "#67728A !important",
              },
              "& .MuiPaginationItem-root.Mui-focusVisible": {
                boxShadow: "none !important",
                outline: "none !important",
                borderColor: "#67728A !important",
              },
              "& .Mui-selected": {
                backgroundColor: "#67728A !important",
                color: "#fff !important",
                borderColor: "#67728A !important",
                borderWidth: "1.5px",
                borderStyle: "solid",
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

export default NewApplications;
