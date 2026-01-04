import { useState } from 'react';
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
  Select,
  Button,
  Chip
} from '@mui/material';
import { Eye, Edit2, FileSignature, Download } from 'lucide-react';
import Navbar from "../components/Navbar";

interface Document {
  id: number;
  name: string;
  assignedBy: string;
  due: string;
  status: 'Pending' | 'In review' | 'Completed';
}

const mockDocuments: Document[] = [
  { id: 1, name: 'Employment contract', assignedBy: 'HR Team', due: 'Jan 10', status: 'In review' },
  { id: 2, name: 'NDA', assignedBy: 'Legal', due: 'Jan 02', status: 'Pending' },
  { id: 3, name: 'Bank account form', assignedBy: 'Finance', due: 'Jan 05', status: 'Pending' },
  { id: 4, name: 'W-9', assignedBy: 'Finance', due: 'Dec 20', status: 'Completed' },
  { id: 5, name: 'Offer letter', assignedBy: 'HR Team', due: 'Dec 18', status: 'Completed' }
];

const recentActivity = [
  { text: 'You signed NDA.pdf', time: 'Today 09:20' },
  { text: 'Employment contract moved to In review', time: 'Yesterday 16:42' },
  { text: 'New document assigned: Bank account form', time: 'Yesterday 10:11' }
];

export default function UserDashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  const getStatusColor = (status: Document['status']) => {
    switch (status) {
      case 'Pending':
        return { bg: 'rgba(37, 99, 235, 0.1)', color: '#2563EB' };
      case 'In review':
        return { bg: 'rgba(247, 144, 9, 0.1)', color: '#F79009' };
      case 'Completed':
        return { bg: 'rgba(18, 183, 106, 0.1)', color: '#12B76A' };
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#F5F7FA' }}>
      <Navbar />

      <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
        <Box sx={{ display: 'flex', gap: 3 }}>
          {/* Left Column - Documents Table */}
          <Box sx={{ flex: 1 }}>
            <Paper
              sx={{
                borderRadius: '12px',
                border: '1px solid #E6E8EE',
                boxShadow: '0px 8px 24px rgba(16, 24, 40, 0.08)',
                backgroundColor: 'white',
                overflow: 'hidden'
              }}
            >
              {/* Card Header */}
              <Box sx={{ p: 3, borderBottom: '1px solid #E6E8EE' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography
                    sx={{
                      fontSize: '16px',
                      fontWeight: 600,
                      color: '#111827',
                      fontFamily: 'Inter, system-ui, Helvetica, Arial, sans-serif'
                    }}
                  >
                    Pending documents
                  </Typography>
                </Box>

                {/* Search and Sort */}
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <TextField
                    size="small"
                    placeholder="Search documents"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    sx={{
                      flex: 1,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '10px',
                        backgroundColor: 'white',
                        fontSize: '14px',
                        fontFamily: 'Inter, system-ui, Helvetica, Arial, sans-serif'
                      }
                    }}
                  />
                  <Select
                    size="small"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    sx={{
                      borderRadius: '10px',
                      fontSize: '14px',
                      minWidth: 150,
                      fontFamily: 'Inter, system-ui, Helvetica, Arial, sans-serif'
                    }}
                  >
                    <MenuItem value="newest">Sort by: Newest</MenuItem>
                    <MenuItem value="oldest">Sort by: Oldest</MenuItem>
                    <MenuItem value="name">Sort by: Name</MenuItem>
                  </Select>
                </Box>
              </Box>

              {/* Table */}
              <TableContainer>
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
                    {mockDocuments.map((doc) => {
                      const statusColor = getStatusColor(doc.status);
                      const isCompleted = doc.status === 'Completed';
                      const isPending = doc.status === 'Pending';

                      return (
                        <TableRow key={doc.id} hover>
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
                                <Eye size={16} />
                              </IconButton>
                              <IconButton
                                size="small"
                                sx={{ color: isCompleted ? '#D0D5DD' : '#667085' }}
                                disabled={isCompleted}
                              >
                                <Edit2 size={16} />
                              </IconButton>
                              {isCompleted ? (
                                <IconButton size="small" sx={{ color: '#667085' }}>
                                  <Download size={16} />
                                </IconButton>
                              ) : (
                                <IconButton
                                  size="small"
                                  sx={{
                                    color: isPending ? '#2563EB' : '#D0D5DD'
                                  }}
                                  disabled={!isPending}
                                >
                                  <FileSignature size={16} />
                                </IconButton>
                              )}
                            </Box>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Pagination */}
              <Box
                sx={{
                  p: 3,
                  borderTop: '1px solid #E6E8EE',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <Typography sx={{ fontSize: '12px', color: '#667085', fontFamily: 'Inter, system-ui, Helvetica, Arial, sans-serif' }}>
                  Showing 1 to 5 of 12 entries
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {[1, 2, 3].map((page) => (
                    <Box
                      key={page}
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: '8px',
                        border: page === 1 ? '1px solid #2563EB' : '1px solid #E6E8EE',
                        backgroundColor: page === 1 ? 'rgba(37, 99, 235, 0.1)' : 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '14px',
                        fontWeight: 500,
                        color: page === 1 ? '#2563EB' : '#667085',
                        cursor: 'pointer',
                        fontFamily: 'Inter, system-ui, Helvetica, Arial, sans-serif'
                      }}
                    >
                      {page}
                    </Box>
                  ))}
                  <Box
                    sx={{
                      px: 2,
                      height: 32,
                      borderRadius: '8px',
                      border: '1px solid #E6E8EE',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px',
                      color: '#667085',
                      cursor: 'pointer',
                      fontFamily: 'Inter, system-ui, Helvetica, Arial, sans-serif'
                    }}
                  >
                    Next
                  </Box>
                </Box>
              </Box>
            </Paper>
          </Box>

          {/* Right Column */}
          <Box sx={{ width: '360px' }}>
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
                  fontSize: '16px',
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
                  { label: 'IN REVIEW', value: '1', color: '#F79009' },
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
              <Button
                fullWidth
                variant="contained"
                sx={{
                  backgroundColor: '#2563EB',
                  color: 'white',
                  textTransform: 'none',
                  borderRadius: '10px',
                  py: 1.5,
                  fontSize: '14px',
                  fontFamily: 'Inter, system-ui, Helvetica, Arial, sans-serif',
                  '&:hover': {
                    backgroundColor: '#1D4ED8'
                  }
                }}
              >
                Continue signing
              </Button>
            </Paper>

            {/* Recent Activity */}
            <Paper
              sx={{
                p: 3,
                borderRadius: '12px',
                border: '1px solid #E6E8EE',
                boxShadow: '0px 8px 24px rgba(16, 24, 40, 0.08)',
                backgroundColor: 'white'
              }}
            >
              <Typography
                sx={{
                  fontSize: '16px',
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
                        fontFamily: 'Inter, system-ui, Helvetica, Arial, sans-serif'
                      }}
                    >
                      {activity.text}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: '12px',
                        color: '#98A2B3',
                        whiteSpace: 'nowrap',
                        fontFamily: 'Inter, system-ui, Helvetica, Arial, sans-serif'
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
