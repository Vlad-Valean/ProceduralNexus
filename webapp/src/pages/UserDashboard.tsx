import React, { useState, useEffect } from 'react';
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
import {FileDownload, FilterList, Edit } from '@mui/icons-material';
import Pagination from '@mui/material/Pagination';

const UserDashboard: React.FC = () => {
  const [documents, setDocuments] = useState<DocumentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [sortMenuAnchor, setSortMenuAnchor] = useState<null | HTMLElement>(null);
  const [page, setPage] = useState(1);

  const rowsPerPage = 7;
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchDocuments = async () => {
      if (!userId) {
        setError('User not logged in');
        setLoading(false);
        return;
      }

      try {
        const data = await documentsApi.getDocuments(userId);
        setDocuments(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load documents');
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [userId]);

  const filteredDocuments = React.useMemo(() => {
    let docs = [...documents];
    
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      docs = docs.filter(doc =>
        doc.name.toLowerCase().includes(q) ||
        doc.uploaderEmail.toLowerCase().includes(q)
      );
    }
    
    if (statusFilter.length > 0) {
      docs = docs.filter(doc => {
        const status = doc.signed ? 'Signed' : 'Unsigned';
        return statusFilter.includes(status);
      });
    }
    
    docs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    return docs;
  }, [documents, searchQuery, statusFilter]);

  const totalPages = Math.ceil(filteredDocuments.length / rowsPerPage);
  const paginatedDocuments = filteredDocuments.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  useEffect(() => {
    setPage(1);
  }, [searchQuery, statusFilter]);

  const handleDownload = async (docId: number, docName: string) => {
    try {
      const blob = await documentsApi.downloadDocument(docId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = docName.endsWith('.pdf') ? docName : `${docName}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    } catch (err) {
      alert('Failed to download document');
    }
  };

  const signedCount = documents.filter(d => d.signed).length;
  const unsignedCount = documents.filter(d => !d.signed).length;

  const getStatusColor = (signed: boolean) => {
    return signed
      ? { bg: 'rgba(18, 183, 106, 0.1)', color: '#12B76A' }
      : { bg: 'rgba(37, 99, 235, 0.1)', color: '#2563EB' };
  };

  return (
    <Box sx={{ minHeight: '100vh' }}>
      <Navbar />
      <Container maxWidth={false} sx={{ mt: 4, mb: 8, px: { xs: 1, sm: 4, md: 8 } }}>
        <Box sx={{ display: 'flex', gap: 4, alignItems: 'flex-start' }}>
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
                          sx={{ pl: 2, minHeight: 28, py: 0.2 }}
                        >
                          <Checkbox
                            checked={statusFilter.includes(option.value)}
                            sx={{
                              p: 0.3,
                              mr: 1,
                              '& .MuiSvgIcon-root': {
                                fontSize: 18,
                                color: '#67728A',
                              },
                              color: '#67728A',
                            }}
                          />
                          <ListItemText
                            primary={option.label}
                            primaryTypographyProps={{ fontSize: '0.92rem' }}
                          />
                        </MenuItem>
                      ))}
                    </Menu>
                  </FormControl>
                </Box>
              </Box>

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

                        return (
                          <TableRow key={doc.id} hover
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
                                <IconButton
                                  size="small"
                                  sx={{ color: '#667085' }}
                                  aria-label="Sign"
                                  onClick={() => {
                                    console.log('Sign document:', doc.id);
                                  }}
                                >
                                  <Edit sx={{ fontSize: 16 }} />
                                </IconButton>
                                <IconButton
                                  size="small"
                                  sx={{ color: '#667085' }}
                                  aria-label="Download"
                                  onClick={() => handleDownload(doc.id, doc.name)}
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
                        <TableCell colSpan={4} sx={{ py: 6, textAlign: 'center', border: 0 }}>
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

          <Box sx={{ width: '420px', minWidth: '340px' }}>
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
                  { label: 'UNSIGNED', value: unsignedCount, color: '#2563EB' },
                  { label: 'SIGNED', value: signedCount, color: '#12B76A' }
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
            </Paper>

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
};

export default UserDashboard;