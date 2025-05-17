import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  Alert,
} from '@mui/material';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

function CheckInList() {
  const [checkIns, setCheckIns] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCheckIns();
  }, []);

  const fetchCheckIns = async () => {
    try {
      const response = await axios.get(`${API_URL}/checkins`);
      setCheckIns(response.data);
    } catch (error) {
      console.error('Error fetching check-ins:', error);
      setError('Failed to load check-ins');
    }
  };

  const handleCheckOut = async (id) => {
    try {
      await axios.patch(`${API_URL}/checkins/${id}/checkout`);
      fetchCheckIns();
    } catch (error) {
      console.error('Error checking out:', error);
      setError('Failed to check out');
    }
  };

  const handleCancel = async (id) => {
    try {
      await axios.patch(`${API_URL}/checkins/${id}/cancel`);
      fetchCheckIns();
    } catch (error) {
      console.error('Error cancelling check-in:', error);
      setError('Failed to cancel check-in');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'checked-in':
        return 'success';
      case 'checked-out':
        return 'info';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Check-in Status
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Full Address</TableCell>
              <TableCell>Check-in Time</TableCell>
              <TableCell>Match Details</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {checkIns.map((checkIn) => (
              <TableRow key={checkIn.id}>
                <TableCell>{checkIn.name || '-'}</TableCell>
                <TableCell>{checkIn.address || '-'}</TableCell>
                <TableCell>
                  {checkIn.checkInTime ? new Date(checkIn.checkInTime).toLocaleString() : 'N/A'}
                </TableCell>
                <TableCell style={{ whiteSpace: 'pre-line' }}>{checkIn.notes || '-'}</TableCell>
                <TableCell>
                  <Chip
                    label={checkIn.status}
                    color={getStatusColor(checkIn.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {checkIn.status === 'checked-in' && (
                    <>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => handleCheckOut(checkIn.id)}
                        sx={{ mr: 1 }}
                      >
                        Check Out
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => handleCancel(checkIn.id)}
                      >
                        Cancel
                      </Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default CheckInList; 