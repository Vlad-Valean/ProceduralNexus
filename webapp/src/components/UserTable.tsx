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
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const firstNames = [
  "Jane", "John", "Alice", "Bob", "Maria", "Alex", "Sara", "Tom", "Emma", "Chris",
  "Olivia", "David", "Sophia", "Mark", "Eva",
];
const lastNames = [
  "Cooper", "Smith", "Johnson", "Williams", "Brown", "Jones", "Miller", "Davis",
  "Garcia", "Martinez", "Wilson", "Moore", "Taylor", "Anderson", "Thomas",
];

const allUsers = Array.from({ length: 215 }, (_, i) => ({
  firstName: firstNames[i % firstNames.length],
  lastName: lastNames[i % lastNames.length],
  email: `${firstNames[i % firstNames.length].toLowerCase()}.${lastNames[
    i % lastNames.length
  ].toLowerCase()}@example.com`,
}));

const PAGE_SIZE = 10;

const UserTable: React.FC = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");

  // --- filtering + sorting ---
  let filteredUsers = allUsers.filter((user) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      user.firstName.toLowerCase().includes(q) ||
      user.lastName.toLowerCase().includes(q) ||
      user.email.toLowerCase().includes(q)
    );
  });

  filteredUsers = [...filteredUsers];
  if (sort === "alpha-asc") {
    filteredUsers.sort((a, b) =>
      (a.firstName + " " + a.lastName)
        .toLowerCase()
        .localeCompare((b.firstName + " " + b.lastName).toLowerCase())
    );
  } else if (sort === "alpha-desc") {
    filteredUsers.sort((a, b) =>
      (b.firstName + " " + b.lastName)
        .toLowerCase()
        .localeCompare((a.firstName + " " + a.lastName).toLowerCase())
    );
  } else if (sort === "newest") {
    filteredUsers.reverse();
  } // "oldest" = original order

  const totalUsers = filteredUsers.length;
  const pageCount = Math.ceil(totalUsers / PAGE_SIZE);
  const users = filteredUsers.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const startIdx = (page - 1) * PAGE_SIZE + 1;
  const endIdx = Math.min(page * PAGE_SIZE, totalUsers);

  // how many empty rows we need to keep PAGE_SIZE rows total
  const emptyRows = Math.max(0, PAGE_SIZE - users.length);

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) =>
    setPage(value);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  return (
    <Paper
      sx={{
        p: { xs: 2, sm: 3 },
        borderRadius: 3,
        background: "#fff",
        minHeight: 370,
        boxShadow: "0 2px 16px #bfcbe6",
        width: "100%",          // responsive to parent column
        minWidth: 0,            // allow shrinking inside grid/flex layouts
        display: "flex",        // make the card a flex column
        flexDirection: "column",
        boxSizing: "border-box",
      }}
    >
      {/* Header + Search/Sort Row */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          mb: 1.5,
          flexWrap: "wrap",
        }}
      >
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography
            variant="h5"
            sx={{ fontWeight: 700, color: "#222", mb: 0, textAlign: "left" }}
          >
            All Users
          </Typography>
          <Typography
            variant="subtitle2"
            sx={{ color: "#7b8bb2", fontWeight: 500, mt: 0.5, textAlign: "left" }}
          >
            Organization name
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
            width: { xs: "100%", sm: 140 }, // smaller
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              height: 32, // smaller height
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
            height: 32, // smaller height
            minWidth: 140, // slightly smaller width
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

      {/* Table area – flex:1 so footer stays at bottom */}
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          mb: 2,
          overflowX: "auto", // allow horizontal scroll instead of stretching/overlapping
        }}
      >
        <Table
          sx={{
            tableLayout: "fixed",
            width: "max-content", // always as wide as columns
            minWidth: "100%", // never shrink below container
            borderCollapse: "collapse",
          }}
        >
          <TableHead>
            <TableRow sx={{ "& th": { py: 1 } }}>
              <TableCell
                sx={{
                  width: 110,
                  minWidth: 100,
                  maxWidth: 110,
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
                  width: 110,
                  minWidth: 100,
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
                  fontWeight: 500,
                  color: "#B5B7C0",
                  borderBottom: "1px solid #e3e8f2",
                  textAlign: "left",
                  fontSize: "0.8rem",
                }}
              >
                Email
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.length > 0 ? (
              <>
                {users.map((user, idx) => (
                  <TableRow key={idx + startIdx} sx={{ "& td": { py: 0.8 } }}>
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
                      {user.firstName}
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
                      {user.lastName}
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
                      {user.email}
                    </TableCell>
                  </TableRow>
                ))}

                {/* Placeholder empty rows to keep constant height */}
                {emptyRows > 0 &&
                  Array.from({ length: emptyRows }).map((_, idx) => (
                    <TableRow key={`empty-${idx}`} sx={{ "& td": { py: 0.8, borderBottom: "none !important" } }}>
                      <TableCell
                        sx={{
                          fontSize: "0.8rem",
                          borderBottom: "none !important",
                          color: "transparent",
                          pl: 0,
                        }}
                      >
                        &nbsp;
                      </TableCell>
                      <TableCell
                        sx={{
                          fontSize: "0.8rem",
                          borderBottom: "none !important",
                          color: "transparent",
                        }}
                      >
                        &nbsp;
                      </TableCell>
                      <TableCell
                        sx={{
                          fontSize: "0.8rem",
                          borderBottom: "none !important",
                          color: "transparent",
                        }}
                      >
                        &nbsp;
                      </TableCell>
                    </TableRow>
                  ))}
              </>
            ) : (
              <TableRow>
                <TableCell colSpan={3} sx={{ border: 0, py: 6, px: 0 }}>
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
                      No results...
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Box>

      {/* Pagination and Info Row – pushed to bottom by flex layout */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mt: "auto",
          pt: 1.5,
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
            {`Showing data ${startIdx} to ${endIdx} of ${totalUsers} entries`}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Pagination
            count={pageCount}
            page={page}
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
    </Paper>
  );
};

export default UserTable;
