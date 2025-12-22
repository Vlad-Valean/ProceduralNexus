import React, { useState } from "react";
import {
  Paper,
  Button,
  Box,
  Typography,
  TextField,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Pagination,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

// Mock log data for demonstration
const MOCK_LOGS = [
  {
    timestamp: "2024-05-01 10:15:00",
    user: "alice@example.com",
    action: "Login",
    description: "User logged in successfully.",
  },
  {
    timestamp: "2024-05-01 10:17:23",
    user: "bob@example.com",
    action: "Upload",
    description: "Uploaded document contract.pdf.",
  },
  {
    timestamp: "2024-05-01 10:20:10",
    user: "carol@example.com",
    action: "Download",
    description: "Downloaded file resume.pdf.",
  },
  {
    timestamp: "2024-05-01 11:00:00",
    user: "alice@example.com",
    action: "Logout",
    description: "User logged out.",
  },
  {
    timestamp: "2024-05-02 09:00:00",
    user: "bob@example.com",
    action: "Login",
    description: "User logged in successfully.",
  },
  { timestamp: "2024-05-02 09:05:00", user: "dave@example.com", action: "Delete", description: "Deleted file old_contract.pdf." },
  { timestamp: "2024-05-02 09:10:00", user: "eve@example.com", action: "Edit", description: "Edited profile information." },
  { timestamp: "2024-05-02 09:15:00", user: "frank@example.com", action: "Share", description: "Shared document NDA.pdf." },
  {
    timestamp: "2024-05-02 09:20:00",
    user: "grace@example.com",
    action: "Login",
    description: "User logged in successfully.",
  },
  {
    timestamp: "2024-05-02 09:25:00",
    user: "heidi@example.com",
    action: "Upload",
    description: "Uploaded document invoice.pdf.",
  },
  {
    timestamp: "2024-05-02 09:30:00",
    user: "ivan@example.com",
    action: "Download",
    description: "Downloaded file offer.pdf.",
  },
  {
    timestamp: "2024-05-02 09:35:00",
    user: "judy@example.com",
    action: "Logout",
    description: "User logged out.",
  },
  {
    timestamp: "2024-05-03 08:00:00",
    user: "alice@example.com",
    action: "Login",
    description: "User logged in successfully.",
  },
  {
    timestamp: "2024-05-03 08:05:00",
    user: "bob@example.com",
    action: "Edit",
    description: "Changed password.",
  },
  {
    timestamp: "2024-05-03 08:10:00",
    user: "carol@example.com",
    action: "Upload",
    description: "Uploaded document report.pdf.",
  },
  {
    timestamp: "2024-05-03 08:15:00",
    user: "dave@example.com",
    action: "Download",
    description: "Downloaded file summary.pdf.",
  },
  {
    timestamp: "2024-05-03 08:20:00",
    user: "eve@example.com",
    action: "Logout",
    description: "User logged out.",
  },
  {
    timestamp: "2024-05-03 08:25:00",
    user: "frank@example.com",
    action: "Share",
    description: "Shared document roadmap.pdf.",
  },
  {
    timestamp: "2024-05-03 08:30:00",
    user: "grace@example.com",
    action: "Login",
    description: "User logged in successfully.",
  },
  {
    timestamp: "2024-05-03 08:35:00",
    user: "heidi@example.com",
    action: "Edit",
    description: "Updated contact details.",
  },
];

interface AdminLogsProps {
  onBack: () => void;
  logsTarget?: string | null;
}

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

const LOGS_PAGE_SIZE_ALL = 8;
const LOGS_PAGE_SIZE_OTHER = 7;
const ROW_HEIGHT = 36;

const AdminLogs: React.FC<AdminLogsProps> = ({ onBack, logsTarget }) => {
  // Timestamp filter states
  const [startDate, setStartDate] = useState<string>("");
  const [startTime, setStartTime] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [page, setPage] = useState(1);

  // Helper to get combined datetime string or undefined
  const getDateTime = (date: string, time: string) => {
    if (!date) return undefined;
    return time ? `${date}T${time}` : `${date}T00:00`;
  };

  // Filter logs by timestamp range
  const filteredLogs = MOCK_LOGS.filter((log) => {
    const logDate = log.timestamp.replace(" ", "T");
    const start = getDateTime(startDate, startTime);
    const end = getDateTime(endDate, endTime);

    if (start && logDate < start) return false;
    if (end && logDate > end) return false;
    return true;
  });

  // Use 8 entries per page for "all server logs", otherwise 7
  const pageSize = logsTarget === undefined || logsTarget === null ? LOGS_PAGE_SIZE_ALL : LOGS_PAGE_SIZE_OTHER;

  const total = filteredLogs.length;
  const pageCount = Math.ceil(total / pageSize) || 1;
  const safePage = Math.min(page, pageCount);

  const logsToShow = filteredLogs.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize
  );

  const startIdx = total === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const endIdx = Math.min(safePage * pageSize, total);

  const hasResults = logsToShow.length > 0;
  const emptyRows = hasResults
    ? Math.max(0, pageSize - logsToShow.length)
    : Math.max(0, pageSize - 1);

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
      {/* Show back button only for user or organization logs, not for all logs */}
      {logsTarget !== undefined && logsTarget !== null && logsTarget !== "" && (
        <Button
          onClick={onBack}
          startIcon={<ArrowBackIosNewIcon sx={{ fontSize: 14 }} />}
          sx={{
            textTransform: "none",
            color: "#67728A",
            fontWeight: 500,
            fontSize: "0.9rem",
            px: 0,
            mb: 2,
            "&:hover": { backgroundColor: "transparent", color: "#3D3C42" },
            "&:focus": { outline: "none" },
            justifyContent: "flex-start",
          }}
        >
          Back
        </Button>
      )}
      <Box sx={{ width: "100%", mb: 2 }}>
        <Typography
          variant="h6"
          sx={{
            color: "#222",
            fontWeight: 700,
            fontSize: { xs: "1.3rem", sm: "1.5rem" },
            textAlign: "left",
            whiteSpace: "pre-line",
            mb: logsTarget === undefined || logsTarget === null ? 1.5 : 0, // add space if showing all server logs
          }}
        >
          {logsTarget === undefined || logsTarget === null
            ? "Showing all server logs"
            : (
                <>
                  {"Showing logs for\n"}
                  <span style={{ color: "#67728A", fontWeight: 500, fontSize: "1.2rem" }}>{logsTarget}</span>
                </>
              )
          }
        </Typography>
      </Box>

      {/* Timestamp selector */}
      <Box sx={{ width: "100%", mb: 2, display: "flex", alignItems: "center", flexWrap: "nowrap", gap: 1 }}>
        <Typography sx={{ fontWeight: 500, color: "#67728A", fontSize: "0.85rem" }}>
          From:
        </Typography>
        <TextField
          type="date"
          size="small"
          value={startDate}
          onChange={e => {
            setStartDate(e.target.value);
            setPage(1);
            if (!e.target.value) setStartTime("");
          }}
          sx={{
            width: 135,
            background: "#f4f6fb",
            borderRadius: 2,
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              height: 32,
              fontSize: "0.8rem",
              background: "#f4f6fb",
              "& fieldset": { borderColor: "#dde3f0" },
              "&:hover fieldset": { borderColor: "#cfd6e6" },
              "&.Mui-focused fieldset": { borderColor: "#a5b1c8" },
            },
            "& input": {
              color: "#67728A",
              background: "transparent",
              borderRadius: 2,
              boxSizing: "border-box",
            },
          }}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          type="time"
          size="small"
          value={startTime}
          onChange={e => {
            setStartTime(e.target.value);
            setPage(1);
          }}
          sx={{
            width: 90,
            background: "#f4f6fb",
            borderRadius: 2,
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              height: 32,
              fontSize: "0.8rem",
              background: "#f4f6fb",
              "& fieldset": { borderColor: "#dde3f0" },
              "&:hover fieldset": { borderColor: "#cfd6e6" },
              "&.Mui-focused fieldset": { borderColor: "#a5b1c8" },
            },
            "& input": {
              color: "#67728A",
              background: "transparent",
              borderRadius: 2,
              boxSizing: "border-box",
            },
          }}
          InputLabelProps={{ shrink: true }}
          inputProps={{
            placeholder: "--:--",
          }}
        />
        <Typography sx={{ fontWeight: 500, color: "#67728A", fontSize: "0.85rem" }}>
          To:
        </Typography>
        <TextField
          type="date"
          size="small"
          value={endDate}
          onChange={e => {
            setEndDate(e.target.value);
            setPage(1);
            if (!e.target.value) setEndTime("");
          }}
          sx={{
            width: 135,
            background: "#f4f6fb",
            borderRadius: 2,
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              height: 32,
              fontSize: "0.8rem",
              background: "#f4f6fb",
              "& fieldset": { borderColor: "#dde3f0" },
              "&:hover fieldset": { borderColor: "#cfd6e6" },
              "&.Mui-focused fieldset": { borderColor: "#a5b1c8" },
            },
            "& input": {
              color: "#67728A",
              background: "transparent",
              borderRadius: 2,
              boxSizing: "border-box",
            },
          }}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          type="time"
          size="small"
          value={endTime}
          onChange={e => {
            setEndTime(e.target.value);
            setPage(1);
          }}
          sx={{
            width: 90,
            background: "#f4f6fb",
            borderRadius: 2,
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              height: 32,
              fontSize: "0.8rem",
              background: "#f4f6fb",
              "& fieldset": { borderColor: "#dde3f0" },
              "&:hover fieldset": { borderColor: "#cfd6e6" },
              "&.Mui-focused fieldset": { borderColor: "#a5b1c8" },
            },
            "& input": {
              color: "#67728A",
              background: "transparent",
              borderRadius: 2,
              boxSizing: "border-box",
            },
          }}
          InputLabelProps={{ shrink: true }}
          inputProps={{
            placeholder: "--:--",
          }}
        />
      </Box>
      {/* Add whitespace after timestamp selector if showing all server logs */}
      {logsTarget === undefined || logsTarget === null ? (
        <Box sx={{ width: "100%", height: 14 }} />
      ) : null}

      {/* Logs table */}
      <Box sx={{ width: "100%", flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
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
                <TableCell sx={{ ...headCellSx, width: "22%" }}>Timestamp</TableCell>
                <TableCell sx={{ ...headCellSx, width: "28%" }}>User mail</TableCell>
                <TableCell sx={{ ...headCellSx, width: "20%" }}>Action</TableCell>
                <TableCell sx={{ ...headCellSx, width: "30%" }}>Action description</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {hasResults ? (
                <>
                  {logsToShow.map((log, idx) => (
                    <TableRow key={idx} sx={{ height: ROW_HEIGHT, "& td": { py: 0.8 } }}>
                      <TableCell sx={{ ...bodyCellSx, color: "#222" }}>{log.timestamp}</TableCell>
                      <TableCell sx={{ ...bodyCellSx, color: "#67728A" }}>{log.user}</TableCell>
                      <TableCell sx={{ ...bodyCellSx, color: "#222" }}>{log.action}</TableCell>
                      <TableCell sx={{ ...bodyCellSx, color: "#222" }}>{log.description}</TableCell>
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
                <TableRow>
                  <TableCell colSpan={4} sx={{ ...bodyCellSx, textAlign: "center" }}>
                    <Typography sx={{ color: "#b5b7c0", fontWeight: 500, fontSize: "0.9rem" }}>
                      No logs found.
                    </Typography>
                  </TableCell>
                </TableRow>
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
            flexWrap: "wrap",
            width: "100%",
            minHeight: 48,
            marginTop: "auto",
            position: "sticky",
            bottom: 0,
            background: "#fff",
            zIndex: 1,
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
              {filteredLogs.length === 0
                ? "Showing data 0 of 0 entries"
                : `Showing data ${startIdx} to ${endIdx} of ${filteredLogs.length} entries`}
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
    </Paper>
  );
};

export default AdminLogs;
