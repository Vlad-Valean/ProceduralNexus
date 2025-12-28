import React, { useMemo, useState } from "react";
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
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import type { OrganizationRow } from "../utils/admin";

const PAGE_SIZE = 7;

interface OrganizationTableProps {
  organizations: OrganizationRow[];
  loading: boolean;
  error: string | null;
  onRowClick?: (org: OrganizationRow) => void;
}

function formatDateGB(iso: string | null): string {
  if (!iso) return "-";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleDateString("en-GB");
}

const OrganizationTable: React.FC<OrganizationTableProps> = ({
  organizations,
  loading,
  error,
  onRowClick,
}) => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("employees-desc");

  const filteredOrgs = useMemo(() => {
    let result = organizations.filter((org) => {
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        org.name.toLowerCase().includes(q) ||
        (org.ownerEmail ?? "").toLowerCase().includes(q)
      );
    });

    result = [...result];

    if (sort === "employees-asc") result.sort((a, b) => a.employees - b.employees);
    else if (sort === "employees-desc") result.sort((a, b) => b.employees - a.employees);
    else if (sort === "date-asc")
      result.sort((a, b) => new Date(a.createdAt ?? 0).getTime() - new Date(b.createdAt ?? 0).getTime());
    else if (sort === "date-desc")
      result.sort((a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime());
    else if (sort === "name-asc")
      result.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
    else if (sort === "name-desc")
      result.sort((a, b) => b.name.toLowerCase().localeCompare(a.name.toLowerCase()));

    return result;
  }, [organizations, search, sort]);

  const totalOrgs = filteredOrgs.length;
  const pageCount = Math.max(1, Math.ceil(totalOrgs / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);

  const orgs = filteredOrgs.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const startIdx = totalOrgs === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1;
  const endIdx = Math.min(safePage * PAGE_SIZE, totalOrgs);

  const emptyRows = Math.max(0, PAGE_SIZE - orgs.length);

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => setPage(value);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleSortChange = (event: SelectChangeEvent<string>) => {
    setSort(event.target.value);
    setPage(1);
  };

  const getSortLabel = (selected: string) => {
    let label = "";
    switch (selected) {
      case "employees-asc":
        label = "Employees (asc)";
        break;
      case "employees-desc":
        label = "Employees (desc)";
        break;
      case "date-asc":
        label = "Created date (oldest)";
        break;
      case "date-desc":
        label = "Created date (newest)";
        break;
      case "name-asc":
        label = "Name (A-Z)";
        break;
      case "name-desc":
        label = "Name (Z-A)";
        break;
      default:
        label = "Employees (desc)";
    }
    return (
      <span>
        <span style={{ color: "#7E7E7E" }}>Sort by : </span>
        <b style={{ color: "#222" }}>{label}</b>
      </span>
    );
  };

  return (
    <Paper
      sx={{
        px: { xs: 2.5, sm: 2.5 },
        pt: { xs: 2.5, sm: 2.5 },
        pb: { xs: 1.2, sm: 1.2 },
        borderRadius: 3,
        background: "#fff",
        boxShadow: "0 2px 16px #bfcbe6",
        width: "100%",
        minWidth: 0,
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
        mb: 0,
        height: "100%",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2, flexWrap: "wrap" }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" sx={{ color: "#222", fontWeight: 700, textAlign: "left", mb: 0 }}>
            All organizations
          </Typography>
          <Typography variant="subtitle2" sx={{ color: "#7b8bb2", fontWeight: 500, mt: 0.5, textAlign: "left" }}>
            {loading ? "Loading..." : `${organizations.length} organizations registered`}
          </Typography>
          {error && (
            <Typography sx={{ color: "#d32f2f", fontWeight: 600, mt: 0.5, fontSize: "0.85rem" }}>
              {error}
            </Typography>
          )}
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
            width: 110,
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              height: 28,
              fontSize: "0.78rem",
              "& fieldset": { borderColor: "#dde3f0" },
              "&:hover fieldset": { borderColor: "#cfd6e6" },
              "&.Mui-focused fieldset": { borderColor: "#a5b1c8" },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "#3D3C42", fontSize: 16 }} />
              </InputAdornment>
            ),
          }}
        />

        <Select
          value={sort}
          onChange={handleSortChange}
          size="small"
          sx={{
            bgcolor: "#f4f6fb",
            borderRadius: 2,
            height: 28,
            minWidth: 120,
            fontWeight: 500,
            fontSize: "0.55rem",
            "& .MuiOutlinedInput-notchedOutline": { borderColor: "#dde3f0 !important" },
            "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#cfd6e6 !important" },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#a5b1c8 !important" },
          }}
          renderValue={() => getSortLabel(sort)}
        >
          <MenuItem value="employees-desc" sx={{ fontSize: "0.75rem", py: 0.5 }}>
            <b style={{ color: "#222" }}>Employees (desc)</b>
          </MenuItem>
          <MenuItem value="employees-asc" sx={{ fontSize: "0.75rem", py: 0.5 }}>
            <b style={{ color: "#222" }}>Employees (asc)</b>
          </MenuItem>
          <MenuItem value="date-desc" sx={{ fontSize: "0.75rem", py: 0.5 }}>
            <b style={{ color: "#222" }}>Created date (newest)</b>
          </MenuItem>
          <MenuItem value="date-asc" sx={{ fontSize: "0.75rem", py: 0.5 }}>
            <b style={{ color: "#222" }}>Created date (oldest)</b>
          </MenuItem>
          <MenuItem value="name-asc" sx={{ fontSize: "0.75rem", py: 0.5 }}>
            <b style={{ color: "#222" }}>Name (A-Z)</b>
          </MenuItem>
          <MenuItem value="name-desc" sx={{ fontSize: "0.75rem", py: 0.5 }}>
            <b style={{ color: "#222" }}>Name (Z-A)</b>
          </MenuItem>
        </Select>
      </Box>

      <Box sx={{ flex: 1, minHeight: 0, mb: 2, overflowX: "auto", overflowY: "auto" }}>
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
              <TableCell sx={{ width: 110, minWidth: 100, maxWidth: 110, fontWeight: 500, color: "#B5B7C0", borderBottom: "1px solid #e3e8f2", textAlign: "left", fontSize: "0.8rem", px: 0 }}>
                Organization
              </TableCell>
              <TableCell sx={{ width: 170, minWidth: 160, maxWidth: 220, fontWeight: 500, color: "#B5B7C0", borderBottom: "1px solid #e3e8f2", textAlign: "left", fontSize: "0.8rem" }}>
                Owner
              </TableCell>
              <TableCell sx={{ width: 60, minWidth: 60, maxWidth: 60, fontWeight: 500, color: "#B5B7C0", borderBottom: "1px solid #e3e8f2", textAlign: "left", fontSize: "0.8rem" }}>
                Employees
              </TableCell>
              <TableCell sx={{ width: 90, minWidth: 90, maxWidth: 90, fontWeight: 500, color: "#B5B7C0", borderBottom: "1px solid #e3e8f2", textAlign: "left", fontSize: "0.8rem" }}>
                Created date
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} sx={{ border: 0, py: 6, px: 0 }}>
                  <Box sx={{ display: "flex", justifyContent: "center", color: "#64748b" }}>
                    Loading organizations...
                  </Box>
                </TableCell>
              </TableRow>
            ) : orgs.length > 0 ? (
              <>
                {orgs.map((org) => (
                  <TableRow
                    key={org.id}
                    sx={{
                      "& td": { py: 0.8 },
                      cursor: "pointer",
                      transition: "background 0.2s",
                      "&:hover": { backgroundColor: "#F9FBFF" },
                    }}
                    onClick={() => onRowClick?.(org)}
                  >
                    <TableCell sx={{ fontSize: "0.8rem", borderBottom: "1px solid #e3e8f2", color: "#222", fontWeight: 500, textAlign: "left", px: 0 }}>
                      {org.name}
                    </TableCell>
                    <TableCell sx={{ fontSize: "0.8rem", borderBottom: "1px solid #e3e8f2", color: "#222", fontWeight: 500, textAlign: "left" }}>
                      {org.ownerEmail ?? "-"}
                    </TableCell>
                    <TableCell sx={{ fontSize: "0.8rem", borderBottom: "1px solid #e3e8f2", color: "#222", fontWeight: 500, textAlign: "left" }}>
                      {org.employees}
                    </TableCell>
                    <TableCell sx={{ fontSize: "0.8rem", borderBottom: "1px solid #e3e8f2", color: "#222", fontWeight: 500, textAlign: "left" }}>
                      {formatDateGB(org.createdAt)}
                    </TableCell>
                  </TableRow>
                ))}

                {emptyRows > 0 &&
                  Array.from({ length: emptyRows }).map((_, idx) => (
                    <TableRow key={`empty-${idx}`} sx={{ "& td": { py: 0.8, borderBottom: "none !important" } }}>
                      <TableCell sx={{ fontSize: "0.8rem", borderBottom: "none !important", color: "transparent", pl: 0 }}>
                        &nbsp;
                      </TableCell>
                      <TableCell sx={{ fontSize: "0.8rem", borderBottom: "none !important", color: "transparent" }}>
                        &nbsp;
                      </TableCell>
                      <TableCell sx={{ fontSize: "0.8rem", borderBottom: "none !important", color: "transparent" }}>
                        &nbsp;
                      </TableCell>
                      <TableCell sx={{ fontSize: "0.8rem", borderBottom: "none !important", color: "transparent" }}>
                        &nbsp;
                      </TableCell>
                    </TableRow>
                  ))}
              </>
            ) : (
              <TableRow>
                <TableCell colSpan={4} sx={{ border: 0, py: 6, px: 0 }}>
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 100 }}>
                    <Typography sx={{ color: "#b5b7c0", fontWeight: 500, fontSize: "1.2rem" }}>
                      No results...
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mt: "auto", pt: 0.5, flexWrap: "wrap", width: "100%" }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="body2" sx={{ color: "#B5B7C0", fontWeight: 500, textAlign: "left", fontSize: "0.75rem" }}>
            {totalOrgs === 0
              ? "Showing data 0 to 0 of 0 entries"
              : `Showing data ${startIdx} to ${endIdx} of ${totalOrgs} entries`}
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
    </Paper>
  );
};

export default OrganizationTable;
