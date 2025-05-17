import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Container,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://farm-produce-pickup.vercel.app';

function Dashboard() {
  const [checkInData, setCheckInData] = useState([]);
  const [weeklyData, setWeeklyData] = useState({
    dates: [],
    addressData: [],
    recentCheckIns: [],
    checkInDates: [],
  });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      console.log('Fetching data from:', `${API_URL}/checkins`);
      // Fetch check-ins
      const checkInsResponse = await axios.get(`${API_URL}/checkins`);
      console.log('API Response:', checkInsResponse.data);
      // Filter for only checked-in status
      const checkIns = checkInsResponse.data.filter(checkIn => checkIn.status === 'checked-in');
      console.log('Filtered check-ins:', checkIns);

      // Get all unique dates from check-ins
      const allDates = [...new Set(checkIns
        .filter(checkIn => checkIn.checkInTime)
        .map(checkIn => new Date(checkIn.checkInTime).toLocaleDateString())
      )].sort((a, b) => new Date(b) - new Date(a)); // Sort dates in descending order

      // Create a map to store the most recent check-in for each address per day
      const latestCheckInMap = new Map();
      
      checkIns.forEach(checkIn => {
        if (!checkIn.checkInTime || !checkIn.addressId) return;
        
        const date = new Date(checkIn.checkInTime).toLocaleDateString();
        const key = `${checkIn.addressId}-${date}`;
        
        const existing = latestCheckInMap.get(key);
        if (!existing || new Date(checkIn.checkInTime) > new Date(existing.checkInTime)) {
          latestCheckInMap.set(key, checkIn);
        }
      });

      // Create a map of addresses with their check-in dates
      const addressCheckInMap = new Map();
      checkIns.forEach(checkIn => {
        if (checkIn.status === 'checked-in') {  // Only consider checked-in status
          const date = new Date(checkIn.checkInTime).toLocaleDateString();
          if (!addressCheckInMap.has(checkIn.address)) {
            addressCheckInMap.set(checkIn.address, {
              name: checkIn.name,
              address: checkIn.address,
              dates: new Set([date])
            });
          } else {
            addressCheckInMap.get(checkIn.address).dates.add(date);
          }
        }
      });

      // Convert to array and sort by most recent check-in
      const recentCheckInData = Array.from(addressCheckInMap.values())
        .map(data => ({
          ...data,
          dates: Array.from(data.dates).sort((a, b) => new Date(b) - new Date(a))
        }))
        .filter(data => data.dates.length > 0)
        .sort((a, b) => a.address.localeCompare(b.address)); // Sort by address

      setWeeklyData({
        dates: allDates,
        addressData: [],
        recentCheckIns: recentCheckInData,
        checkInDates: allDates
      });

      setCheckInData({
        xAxis: allDates,
        series: [{
          data: allDates.map(date => {
            const count = Array.from(latestCheckInMap.entries())
              .filter(([key, checkIn]) => key.endsWith(date) && checkIn.status === 'checked-in')  // Only count checked-in status
              .length;
            return count;
          }),
          label: 'Check-ins',
        }],
      });

      setError('');
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load dashboard data');
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom 
          sx={{ 
            color: '#2E7D32',
            fontFamily: 'Playfair Display',
            fontWeight: 700,
          }}
        >
          Farm Produce Pickup Dashboard
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Paper 
          sx={{ 
            p: 3, 
            mt: 3,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            border: '1px solid rgba(76, 175, 80, 0.2)',
          }}
        >
          <Typography 
            variant="h6" 
            gutterBottom
            sx={{ 
              color: '#1B5E20',
              fontFamily: 'Playfair Display',
            }}
          >
            Daily Check-ins
          </Typography>
          
          {checkInData.xAxis && checkInData.xAxis.length > 0 ? (
            <Box sx={{ width: '100%', height: 400 }}>
              <BarChart
                xAxis={[{ 
                  scaleType: 'band', 
                  data: checkInData.xAxis,
                  label: 'Date',
                }]}
                series={checkInData.series}
                height={400}
                colors={['#81C784']}
                sx={{
                  '.MuiBarElement-root:hover': {
                    fill: '#4CAF50',
                  },
                }}
              />
            </Box>
          ) : (
            <Typography color="text.secondary">
              No check-in data available.
            </Typography>
          )}
        </Paper>

        <Paper 
          sx={{ 
            p: 3, 
            mt: 3,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            border: '1px solid rgba(76, 175, 80, 0.2)',
          }}
        >
          <Typography 
            variant="h6" 
            gutterBottom
            sx={{ 
              color: '#1B5E20',
              fontFamily: 'Playfair Display',
            }}
          >
            Check-in Status
          </Typography>
          
          {weeklyData.recentCheckIns && weeklyData.recentCheckIns.length > 0 ? (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Address</TableCell>
                    {weeklyData.checkInDates.map(date => (
                      <TableCell key={date} align="center">{date}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {weeklyData.recentCheckIns.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{row.name}</TableCell>
                      <TableCell>{row.address}</TableCell>
                      {weeklyData.checkInDates.map(date => (
                        <TableCell key={date} align="center">
                          {row.dates.includes(date) ? '✓' : ''}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography color="text.secondary">
              No check-ins available.
            </Typography>
          )}
        </Paper>
      </Box>
    </Container>
  );
}

export default Dashboard; 