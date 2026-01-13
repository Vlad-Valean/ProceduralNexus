import React, { useState, useMemo } from "react";
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
import { fetchLogs, UserActivityRow } from "../utils/admin";

// Logs fetched from server


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
  const [startDate, setStartDate] = useState<string>("");
  const [startTime, setStartTime] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [page, setPage] = useState(1);

  const [logs, setLogs] = useState<UserActivityRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const token = useMemo(() => localStorage.getItem("token") || "", []);

  const loadLogs = async () => {
    if (!token) return setError("Not authenticated (missing token).");
    setLoading(true);
    setError(null);
    try {
      const data = await fetchLogs(token, logsTarget ?? undefined);
      setLogs(Array.isArray(data) ? data : []);
      setPage(1);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      if (msg.includes("(401)")) {
        // 401 when fetching logs often means 'not authorized to view logs' for this account.
        // Do NOT clear the user's session here; just show a friendly message so they can continue using the app.
        setError("Not authorized to view logs.");
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadLogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [logsTarget]);

  const getDateTime = (date: string, time: string) => {
    if (!date) return undefined;
    return time ? `${date}T${time}` : `${date}T00:00`;
  };

  const filteredLogs = logs.filter((log) => {
    const logDate = (log.createdAt || "").replace(" ", "T");
    const start = getDateTime(startDate, startTime);
    const end = getDateTime(endDate, endTime);

    if (start && logDate < start) return false;
    if (end && logDate > end) return false;
    return true;
  });

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
            mb: logsTarget === undefined || logsTarget === null ? 1.5 : 0,
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
      {logsTarget === undefined || logsTarget === null ? (
        <Box sx={{ width: "100%", height: 14 }} />
      ) : null}

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
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} sx={{ ...bodyCellSx, textAlign: "center" }}>
                    <Typography sx={{ color: "#67728A", fontWeight: 500 }}>Loading logs…</Typography>
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={4} sx={{ ...bodyCellSx, textAlign: "center" }}>
                    <Typography sx={{ color: "#e25555", fontWeight: 500 }}>{error}</Typography>
                  </TableCell>
                </TableRow>
              ) : hasResults ? (
                <>
                  {logsToShow.map((log, idx) => (
                    <TableRow key={idx} sx={{ height: ROW_HEIGHT, "& td": { py: 0.8 } }}>
                      <TableCell sx={{ ...bodyCellSx, color: "#222" }}>{log.createdAt ? new Date(log.createdAt).toLocaleString() : "-"}</TableCell>
                      <TableCell sx={{ ...bodyCellSx, color: "#67728A" }}>{log.userEmail ?? "-"}</TableCell>
                      <TableCell sx={{ ...bodyCellSx, color: "#222" }}>{log.action}</TableCell>
                      <TableCell sx={{ ...bodyCellSx, color: "#222" }}>{log.description ?? ""}</TableCell>
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
