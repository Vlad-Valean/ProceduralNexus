import React, { useState } from "react";
import {
  Paper,
  Button,
  Box,
  Typography,
  IconButton,
  TextField,
  InputAdornment,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import SearchIcon from "@mui/icons-material/Search";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import ListAltOutlinedIcon from "@mui/icons-material/ListAltOutlined";
import AdminLogs from "./AdminLogs";

export interface Organization {
  organization: string;
  owner: string;
  employees: number;
  createdDate: string;
}

interface OrganizationDetailProps {
  organization: Organization;
  onBack: () => void;
}

const MOCK_EMPLOYEES = [
  { email: "alice@example.com", role: "User" },
  { email: "bob@example.com", role: "HR" },
  { email: "carol@example.com", role: "User" },
  { email: "dave@example.com", role: "User" },
  { email: "eve@example.com", role: "HR" },
  { email: "frank@example.com", role: "User" },
  { email: "grace@example.com", role: "User" },
  { email: "heidi@example.com", role: "User" },
  { email: "ivan@example.com", role: "User" },
  { email: "judy@example.com", role: "User" },
  // ...add more if needed
];

const EMPLOYEES_PAGE_SIZE = 6;
const ROW_HEIGHT = 36;

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

const OrganizationDetail: React.FC<OrganizationDetailProps> = ({
  organization,
  onBack,
}) => {
  const [search, setSearch] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [showLogsPage, setShowLogsPage] = useState(false);
  const [logsTarget, setLogsTarget] = useState<string | null | undefined>(undefined);

  // Generate employees array to match the number in organization.employees
  const employees = React.useMemo(() => {
    const base = MOCK_EMPLOYEES;
    const count = organization.employees;
    const arr = [];
    for (let i = 0; i < count; ++i) {
      arr.push({
        ...base[i % base.length],
        email: `${base[i % base.length].email.split("@")[0]}${i + 1}@example.com`,
      });
    }
    return arr;
  }, [organization.employees]);

  const filteredEmployees = employees.filter((emp) =>
    emp.email.toLowerCase().includes(search.toLowerCase())
  );

  const total = filteredEmployees.length;
  const pageCount = Math.ceil(total / EMPLOYEES_PAGE_SIZE) || 1;
  const safePage = Math.min(page, pageCount);

  const employeesToShow = filteredEmployees.slice(
    (safePage - 1) * EMPLOYEES_PAGE_SIZE,
    safePage * EMPLOYEES_PAGE_SIZE
  );

  const startIdx = total === 0 ? 0 : (safePage - 1) * EMPLOYEES_PAGE_SIZE + 1;
  const endIdx = Math.min(safePage * EMPLOYEES_PAGE_SIZE, total);

  const hasResults = employeesToShow.length > 0;
  const emptyRows = hasResults
    ? Math.max(0, EMPLOYEES_PAGE_SIZE - employeesToShow.length)
    : Math.max(0, EMPLOYEES_PAGE_SIZE - 1);

  if (showLogsPage) {
    return (
      <AdminLogs
        onBack={() => {
          // If logsTarget is null, go back to OrganizationStats (parent handles this)
          // Otherwise, go back to organization detail
          if (logsTarget === null) {
            setShowLogsPage(false);
            setLogsTarget(undefined);
            onBack();
          } else {
            setShowLogsPage(false);
            setLogsTarget(undefined);
          }
        }}
        logsTarget={logsTarget}
      />
    );
  }

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
        alignItems: "flex-start",
        justifyContent: "flex-start",
        width: "100%",
        minWidth: 0,
        boxSizing: "border-box",
        height: "100%",
        minHeight: 630,
      }}
    >
      {/* Go back button */}
      <Box sx={{ mb: 1, width: "100%", display: "flex", justifyContent: "flex-start" }}>
        <Button
          onClick={() => {
            setShowLogsPage(true);
            setLogsTarget(null);
          }}
          startIcon={<ArrowBackIosNewIcon sx={{ fontSize: 14 }} />}
          sx={{
            textTransform: "none",
            color: "#67728A",
            fontWeight: 500,
            fontSize: "0.9rem",
            px: 0,
            "&:hover": { backgroundColor: "transparent", color: "#3D3C42" },
            "&:focus": { outline: "none" },
            justifyContent: "flex-start",
          }}
        >
          Go back to general log
        </Button>
      </Box>

      {/* Header: Organization name and Delete button */}
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
          {organization.organization}
        </Typography>
        <Button
          variant="contained"
          color="error"
          startIcon={<DeleteOutlineIcon />}
          onClick={() => setDeleteDialogOpen(true)}
          sx={{
            alignSelf: "center",
            textTransform: "none",
            borderRadius: 2,
            px: 2,
            py: 0.7,
            bgcolor: "#A71818",
            boxShadow: "none",
            fontWeight: 600,
            fontSize: "0.8rem",
            borderColor: "#A71818",
            color: "#fff",
            minWidth: "fit-content",
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
          Delete organization
        </Button>
      </Box>

      {/* Check organization logs link under organization name */}
      <Box sx={{ width: "100%", mb: 1, display: "flex", justifyContent: "flex-start" }}>
        <a
          href="#"
          onClick={e => {
            e.preventDefault();
            setShowLogsPage(true);
            setLogsTarget(organization.organization);
          }}
          style={{
            color: "#586AA2",
            fontWeight: 500,
            fontSize: "0.95rem",
            textDecoration: "underline",
            cursor: "pointer",
            background: "none",
            border: "none",
            padding: 0,
          }}
        >
          [Check organization logs]
        </a>
      </Box>

      {/* Empty row */}
      <Box sx={{ height: 16 }} />

      {/* Details */}
      <Box sx={{ mb: 2, width: "100%" }}>
        <Typography sx={{ fontWeight: 700, color: "#222", mb: 0.5, textAlign: "left", fontSize: "0.95rem" }}>
          Owner:{" "}
          <span style={{ color: "#222", fontWeight: 500 }}>{organization.owner}</span>
        </Typography>
        <Typography sx={{ fontWeight: 700, color: "#222", mb: 0.5, textAlign: "left", fontSize: "0.95rem" }}>
          Created on:{" "}
          <span style={{ color: "#222", fontWeight: 500 }}>{organization.createdDate}</span>
        </Typography>
        <Typography sx={{ fontWeight: 700, color: "#222", textAlign: "left", fontSize: "0.95rem" }}>
          Number of employees:{" "}
          <span style={{ color: "#222", fontWeight: 500 }}>{organization.employees}</span>
        </Typography>
      </Box>

      {/* Employees table controls */}
      <Box
        sx={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 1,
          gap: 2,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            color: "#222",
            textAlign: "left",
            fontSize: "1.1rem",
          }}
        >
          Employees
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <TextField
            placeholder="Search"
            size="small"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            sx={{
              bgcolor: "#f4f6fb",
              borderRadius: 2,
              width: 180,
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
        </Box>
      </Box>

      {/* Employees table - UserDetails style */}
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          mb: 2,
          width: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box sx={{ overflowX: "auto", flex: 1 }}>
          <Table
            sx={{
              tableLayout: "fixed",
              width: "100%",
              borderCollapse: "collapse",
            }}
          >
            <TableHead>
              <TableRow sx={{ "& th": { py: 0.8 } }}>
                <TableCell sx={{ ...headCellSx, width: "40%" }}>Email</TableCell>
                <TableCell sx={{ ...headCellSx, width: "20%" }}>Role</TableCell>
                <TableCell sx={{ ...headCellSx, width: "20%" }}>Reset credentials</TableCell>
                <TableCell sx={{ ...headCellSx, width: "20%" }}>Check logs</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {hasResults ? (
                <>
                  {employeesToShow.map((emp) => (
                    <TableRow
                      key={emp.email}
                      sx={{ height: ROW_HEIGHT, "& td": { py: 0.8 } }}
                    >
                      <TableCell
                        sx={{
                          ...bodyCellSx,
                          color: "#222",
                          fontWeight: 500,
                        }}
                      >
                        {emp.email}
                      </TableCell>
                      <TableCell
                        sx={{
                          ...bodyCellSx,
                          color: "#67728A",
                          fontWeight: 500,
                        }}
                      >
                        {emp.role}
                      </TableCell>
                      <TableCell sx={bodyCellSx}>
                        <IconButton
                          size="small"
                          sx={{
                            color: "#586AA2",
                            "&:hover": { color: "#3D3C42" },
                            "&:focus, &:active, &:focus-visible, &.Mui-focusVisible": {
                              outline: "none",
                              boxShadow: "none",
                              border: "none",
                            },
                          }}
                        >
                          <RestartAltIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                      <TableCell sx={bodyCellSx}>
                        <IconButton
                          size="small"
                          sx={{
                            color: "#586AA2",
                            "&:hover": { color: "#3D3C42" },
                            "&:focus, &:active, &:focus-visible, &.Mui-focusVisible": {
                              outline: "none",
                              boxShadow: "none",
                              border: "none",
                            },
                          }}
                          onClick={() => {
                            setShowLogsPage(true);
                            setLogsTarget(emp.email);
                          }}
                        >
                          <ListAltOutlinedIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
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
        {/* Pagination and entry count */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mt: 1.5,
            flexWrap: "wrap",
            width: "100%",
            minHeight: 48,
            // Ensure pagination stays at the bottom
            marginTop: "auto",
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
              onChange={(_, value) => setPage(value)}
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

      {/* Delete dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
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
            textAlign: "left",
          }}
        >
          Delete organization
        </DialogTitle>
        <DialogContent sx={{ pt: 0 }}>
          <Typography
            sx={{
              mt: 0.5,
              color: "#4b5563",
              fontSize: "0.9rem",
              textAlign: "left",
            }}
          >
            Are you sure you want to delete{" "}
            <strong>{organization.organization}</strong>?
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
                textAlign: "left",
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
            onClick={() => setDeleteDialogOpen(false)}
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
            onClick={() => setDeleteDialogOpen(false)}
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
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default OrganizationDetail;
