import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  TextField,
  MenuItem,
  Chip,
  Checkbox,
  ListItemText,
  FormControl,
  Menu,
  Button
} from '@mui/material';
import { Visibility, Edit, DriveFileRenameOutline, FileDownload, FilterList } from '@mui/icons-material';
import Pagination from '@mui/material/Pagination';

interface Document {
  id: number;
  name: string;
  assignedBy: string;
  due: string;
  status: 'Pending' | 'Completed';
}

const mockDocuments: Document[] = [
  // 100 generated entries
  ...Array.from({ length: 100 }, (_, i) => {
    const id = i + 1;
    const names = [
      'Employment contract', 'NDA', 'Bank account form', 'W-9', 'Offer letter',
      'Onboarding checklist', 'Tax form 1099', 'Code of Conduct', 'Benefits enrollment',
      'Direct deposit form', 'Confidentiality agreement', 'Remote work policy',
      'IT Security Policy', 'Expense reimbursement', 'Travel policy', 'Performance review',
      'Equipment checklist', 'Parking permit', 'Emergency contact form', 'Payroll setup'
    ];
    const assignedBys = [
      'HR Team', 'Legal', 'Finance', 'IT', 'Admin'
    ];
    const statuses: Document['status'][] = ['Pending', 'Completed'];
    // Distribute values for variety
    return {
      id,
      name: names[i % names.length] + (id > names.length ? ` #${Math.floor(id / names.length) + 1}` : ''),
      assignedBy: assignedBys[i % assignedBys.length],
      due: `Mar ${((i % 28) + 1).toString().padStart(2, '0')}`,
      status: statuses[i % statuses.length]
    };
  })
];

const recentActivity = [
  { text: 'You signed NDA.pdf', time: '2026-1-2' },
  { text: 'Employment contract moved to In review', time: '2026-1-1' },
  { text: 'New document assigned: Bank account form', time: '2025-12-12' },
  { text: 'New document assigned: Bank account form', time: '2025-12-12' },
  { text: 'You signed Offer letter.pdf', time: '2025-12-10' },
  { text: 'W-9.pdf marked as Completed', time: '2025-12-08' },
  { text: 'You viewed W-9.pdf', time: '2025-12-07' }
];

const statusOptions = [
  { value: 'Pending', label: 'Pending' },
  { value: 'Completed', label: 'Completed' }
];

const UserDashboard: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [sortMenuAnchor, setSortMenuAnchor] = useState<null | HTMLElement>(null);
  const [page, setPage] = useState(1);

  const rowsPerPage = 7;

  // Filter and sort documents based on search, status, and date
  const filteredDocuments = React.useMemo(() => {
    let docs = [...mockDocuments];
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      docs = docs.filter(
        doc =>
          doc.name.toLowerCase().includes(q) ||
          doc.assignedBy.toLowerCase().includes(q) ||
          doc.due.toLowerCase().includes(q) ||
          doc.status.toLowerCase().includes(q)
      );
    }
    if (statusFilter.length > 0) {
      docs = docs.filter(doc => statusFilter.includes(doc.status));
    }
    docs.sort((a, b) => b.id - a.id); // always newest first
    return docs;
  }, [searchQuery, statusFilter, mockDocuments]);

  const totalPages = Math.ceil(filteredDocuments.length / rowsPerPage);
  const paginatedDocuments = filteredDocuments.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  // Reset to page 1 when search or sort changes
  React.useEffect(() => {
    setPage(1);
  }, [searchQuery, statusFilter]);

  const getStatusColor = (status: Document['status']) => {
    switch (status) {
      case 'Pending':
        return { bg: 'rgba(37, 99, 235, 0.1)', color: '#2563EB' };
      case 'Completed':
        return { bg: 'rgba(18, 183, 106, 0.1)', color: '#12B76A' };
    }
  };

  // Sort bar open/close handlers
  const handleSortMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setSortMenuAnchor(event.currentTarget);
  };
  const handleSortMenuClose = () => {
    setSortMenuAnchor(null);
  };

  return (
    <Box sx={{ minHeight: '100vh' }}>
      <Navbar />
      <Container maxWidth={false} sx={{ mt: 4, mb: 8, px: { xs: 1, sm: 4, md: 8 } }}>
        <Box sx={{ display: 'flex', gap: 4, alignItems: 'flex-start' }}>
          {/* Left Column - Documents Table */}
          <Box sx={{ flex: 2, minWidth: 0 }}>
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
              {/* Card Header */}
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

                {/* Search and Sort */}
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
                        fontFamily: 'Inter, system-ui, Helvetica, Arial, sans-serif',
                        '& fieldset': { borderColor: '#E6E8EE' },
                        '&:hover fieldset': { borderColor: '#67728A' },
                        '&.Mui-focused fieldset': { borderColor: '#67728A' }
                      }
                    }}
                  />
                  <FormControl sx={{ minWidth: 180 }}>
                    <Button
                      variant="outlined"
                      onClick={handleSortMenuOpen}
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
                        boxShadow: 'none !important',
                        outline: 'none !important',
                        '&:hover': { borderColor: '#67728A' },
                        '&.Mui-focused': { borderColor: '#67728A', boxShadow: 'none !important', outline: 'none !important' },
                        '&.MuiButton-outlined': {
                          '&:focus': { borderColor: '#67728A', boxShadow: 'none !important', outline: 'none !important' }
                        }
                      }}
                    >
                      <FilterList sx={{ fontSize: 20, mr: 1 }} />
                      Filter
                    </Button>
                    <Menu
                      anchorEl={sortMenuAnchor}
                      open={Boolean(sortMenuAnchor)}
                      onClose={handleSortMenuClose}
                      PaperProps={{
                        sx: { minWidth: 165, p: 1 }
                      }}
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
                          sx={{ pl: 2, minHeight: 28, py: 0.2 }} // Smaller height and padding
                        >
                          <Checkbox
                            checked={statusFilter.includes(option.value)}
                            sx={{
                              p: 0.3,
                              mr: 1,
                              '& .MuiSvgIcon-root': {
                                fontSize: 18,
                                color: '#67728A', // Set tick color to match outline
                              },
                              color: '#67728A', // Set box outline color
                            }}
                          />
                          <ListItemText
                            primary={option.label}
                            primaryTypographyProps={{ fontSize: '0.92rem' }} // Smaller text
                          />
                        </MenuItem>
                      ))}
                    </Menu>
                  </FormControl>
                </Box>
              </Box>

              {/* Table */}
              <TableContainer sx={{ flex: '1 1 auto' }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell
                        sx={{
                          fontSize: '12px',
                          fontWeight: 500,
                          color: '#667085',
                          textTransform: 'uppercase',
                          letterSpacing: '0.04em',
                          fontFamily: 'Inter, system-ui, Helvetica, Arial, sans-serif',
                          borderBottom: '1px solid #E6E8EE'
                        }}
                      >
                        Name
                      </TableCell>
                      <TableCell
                        sx={{
                          fontSize: '12px',
                          fontWeight: 500,
                          color: '#667085',
                          textTransform: 'uppercase',
                          letterSpacing: '0.04em',
                          fontFamily: 'Inter, system-ui, Helvetica, Arial, sans-serif',
                          borderBottom: '1px solid #E6E8EE'
                        }}
                      >
                        Assigned by
                      </TableCell>
                      <TableCell
                        sx={{
                          fontSize: '12px',
                          fontWeight: 500,
                          color: '#667085',
                          textTransform: 'uppercase',
                          letterSpacing: '0.04em',
                          fontFamily: 'Inter, system-ui, Helvetica, Arial, sans-serif',
                          borderBottom: '1px solid #E6E8EE'
                        }}
                      >
                        Due
                      </TableCell>
                      <TableCell
                        sx={{
                          fontSize: '12px',
                          fontWeight: 500,
                          color: '#667085',
                          textTransform: 'uppercase',
                          letterSpacing: '0.04em',
                          fontFamily: 'Inter, system-ui, Helvetica, Arial, sans-serif',
                          borderBottom: '1px solid #E6E8EE'
                        }}
                      >
                        Status
                      </TableCell>
                      <TableCell
                        sx={{
                          fontSize: '12px',
                          fontWeight: 500,
                          color: '#667085',
                          textTransform: 'uppercase',
                          letterSpacing: '0.04em',
                          fontFamily: 'Inter, system-ui, Helvetica, Arial, sans-serif',
                          borderBottom: '1px solid #E6E8EE'
                        }}
                      >
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedDocuments.length > 0 ? (
                      paginatedDocuments.map((doc) => {
                        const statusColor = getStatusColor(doc.status);
                        const isCompleted = doc.status === 'Completed';
                        const isPending = doc.status === 'Pending';

                        return (
                          <TableRow
                            key={doc.id}
                            hover
                            sx={{
                              height: 54,
                              '& td': { py: 1 },
                              '&:hover': { backgroundColor: '#CBD5E0' }
                            }}
                          >
                            <TableCell
                              sx={{
                                fontSize: '14px',
                                color: '#111827',
                                fontFamily: 'Inter, system-ui, Helvetica, Arial, sans-serif',
                                borderBottom: '1px solid #E6E8EE'
                              }}
                            >
                              {doc.name}
                            </TableCell>
                            <TableCell
                              sx={{
                                fontSize: '14px',
                                color: '#667085',
                                fontFamily: 'Inter, system-ui, Helvetica, Arial, sans-serif',
                                borderBottom: '1px solid #E6E8EE'
                              }}
                            >
                              {doc.assignedBy}
                            </TableCell>
                            <TableCell
                              sx={{
                                fontSize: '14px',
                                color: '#667085',
                                fontFamily: 'Inter, system-ui, Helvetica, Arial, sans-serif',
                                borderBottom: '1px solid #E6E8EE'
                              }}
                            >
                              {doc.due}
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
                                  fontFamily: 'Inter, system-ui, Helvetica, Arial, sans-serif',
                                  height: '24px'
                                }}
                              />
                            </TableCell>
                            <TableCell sx={{ borderBottom: '1px solid #E6E8EE' }}>
                              <Box sx={{ display: 'flex', gap: 1 }}>
                                <IconButton size="small" sx={{ color: '#667085' }}>
                                  <Visibility sx={{ fontSize: 16 }} />
                                </IconButton>
                                <IconButton
                                  size="small"
                                  sx={{ color: isCompleted ? '#D0D5DD' : '#667085' }}
                                  disabled={isCompleted}
                                >
                                  <Edit sx={{ fontSize: 16 }} />
                                </IconButton>
                                {isCompleted ? (
                                  <IconButton size="small" sx={{ color: '#667085' }}>
                                    <FileDownload sx={{ fontSize: 16 }} />
                                  </IconButton>
                                ) : (
                                  <IconButton
                                    size="small"
                                    sx={{
                                      color: isPending ? '#2563EB' : '#D0D5DD'
                                    }}
                                    disabled={!isPending}
                                  >
                                    <DriveFileRenameOutline sx={{ fontSize: 16 }} />
                                  </IconButton>
                                )}
                              </Box>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} sx={{ py: 6, textAlign: 'center', border: 0 }}>
                          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                            <Typography sx={{ color: "#b5b7c0", fontWeight: 600, fontSize: "1.15rem" }}>
                              No documents were assigned to you yet.
                            </Typography>
                            <Typography sx={{ color: "#b5b7c0", fontWeight: 400, fontSize: "0.95rem", maxWidth: 340 }}>
                              You currently have no documents to review, sign, or download. Please check back later or contact your administrator if you believe this is an error.
                            </Typography>
                          </Box>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Pagination */}
              <Box
                sx={{
                  p: 3,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mt: 'auto',
                  flexWrap: 'wrap',
                  width: '95%'
                }}
              >
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{
                    color: "#B5B7C0",
                    fontWeight: 500,
                    textAlign: "left",
                    fontSize: "0.75rem"
                  }}>
                    {filteredDocuments.length === 0
                      ? "Showing data 0 to 0 of 0 entries"
                      : `Showing data ${(page - 1) * rowsPerPage + 1} to ${Math.min(page * rowsPerPage, filteredDocuments.length)} of ${filteredDocuments.length} entries`}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Pagination
                    count={totalPages}
                    page={page}
                    onChange={(_, value) => setPage(value)}
                    siblingCount={1}
                    boundaryCount={1}
                    color="primary"
                    shape="rounded"
                    size="small"
                    sx={{
                      "& .MuiPagination-ul": {
                        gap: 0.5,
                      },
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
                      // Ensure ellipsis is visible for many pages
                      "& .MuiPaginationItem-ellipsis": {
                        mx: "4px",
                      },
                    }}
                    showFirstButton={false}
                    showLastButton={false}
                  />
                </Box>
              </Box>
            </Paper>
          </Box>

          {/* Right Column */}
          <Box sx={{ width: '420px', minWidth: '340px' }}>
            {/* Stats Card */}
            <Paper
              sx={{
                p: 3,
                mb: 3,
                borderRadius: '12px',
                border: '1px solid #E6E8EE',
                boxShadow: '0px 8px 24px rgba(16, 24, 40, 0.08)',
                backgroundColor: 'white'
              }}
            >
              <Typography
                sx={{
                  fontSize: '20px',
                  fontWeight: 600,
                  mb: 3,
                  color: '#111827',
                  fontFamily: 'Inter, system-ui, Helvetica, Arial, sans-serif'
                }}
              >
                Your documents in numbers
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-around', mb: 3 }}>
                {[
                  { label: 'PENDING', value: '3', color: '#2563EB' },
                  { label: 'COMPLETED', value: '8', color: '#12B76A' }
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
                      <Typography
                        sx={{
                          fontSize: '20px',
                          fontWeight: 600,
                          color: stat.color,
                          fontFamily: 'Inter, system-ui, Helvetica, Arial, sans-serif'
                        }}
                      >
                        {stat.value}
                      </Typography>
                    </Box>
                    <Typography
                      sx={{
                        fontSize: '12px',
                        fontWeight: 500,
                        color: '#667085',
                        textTransform: 'uppercase',
                        letterSpacing: '0.02em',
                        fontFamily: 'Inter, system-ui, Helvetica, Arial, sans-serif'
                      }}
                    >
                      {stat.label}
                    </Typography>
                  </Box>
                ))}
              </Box>
              {/* Continue signing button removed as requested */}
            </Paper>

            {/* Recent Activity */}
            <Paper
              sx={{
                p: 3,
                borderRadius: '12px',
                border: '1px solid #E6E8EE',
                boxShadow: '0px 8px 24px rgba(16, 24, 40, 0.08)',
                backgroundColor: 'white',
                minHeight: 340
              }}
            >
              <Typography
                sx={{
                  fontSize: '20px',
                  fontWeight: 600,
                  mb: 3,
                  color: '#111827',
                  fontFamily: 'Inter, system-ui, Helvetica, Arial, sans-serif'
                }}
              >
                Recent activity
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {recentActivity.map((activity, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      gap: 2
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: '14px',
                        color: '#111827',
                        flex: 1,
                        fontFamily: 'Inter, system-ui, Helvetica, Arial, sans-serif',
                        textAlign: 'left'
                      }}
                    >
                      {activity.text}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: '12px',
                        color: '#98A2B3',
                        whiteSpace: 'nowrap',
                        fontFamily: 'Inter, system-ui, Helvetica, Arial, sans-serif',
                        textAlign: 'left'
                      }}
                    >
                      {activity.time}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Paper>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default UserDashboard;

