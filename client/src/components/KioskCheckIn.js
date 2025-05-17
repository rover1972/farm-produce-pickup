import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  Alert,
  IconButton,
  Stack,
  Chip,
  TextField,
} from '@mui/material';
import BackspaceIcon from '@mui/icons-material/Backspace';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

function KioskCheckIn() {
  const [number, setNumber] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [checkInsByDate, setCheckInsByDate] = useState({});
  const [addresses, setAddresses] = useState([]);
  const [matchedAddress, setMatchedAddress] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    fetchCheckInCount();
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      console.log('Fetching addresses from:', `${API_URL}/addresses`);
      const response = await axios.get(`${API_URL}/addresses`);
      console.log('Received addresses:', response.data);
      if (response.data && Array.isArray(response.data)) {
        setAddresses(response.data);
      } else {
        console.error('Invalid addresses data received:', response.data);
        setError('Invalid addresses data received');
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
      setError('Failed to load addresses. Please try again later.');
    }
  };

  const fetchCheckInCount = async () => {
    try {
      console.log('Fetching check-ins from:', `${API_URL}/checkins`);
      const response = await axios.get(`${API_URL}/checkins`);
      console.log('Received check-ins:', response.data);
      
      if (response.data && Array.isArray(response.data)) {
        const activeCheckIns = response.data.filter(checkIn => checkIn.status === 'checked-in');
        
        // Group check-ins by date
        const groupedCheckIns = activeCheckIns.reduce((acc, checkIn) => {
          const date = new Date(checkIn.checkInTime).toLocaleDateString();
          if (!acc[date]) {
            acc[date] = [];
          }
          acc[date].push(checkIn);
          return acc;
        }, {});
        
        console.log('Grouped check-ins:', groupedCheckIns);
        setCheckInsByDate(groupedCheckIns);
      } else {
        console.error('Invalid check-ins data received:', response.data);
        setError('Invalid check-ins data received');
      }
    } catch (error) {
      console.error('Error fetching check-ins:', error);
      setError('Failed to load check-ins. Please try again later.');
    }
  };

  const findMatchingAddress = (input) => {
    if (!input) {
      setMatchedAddress(null);
      setSuggestions([]);
      setError('');
      return;
    }

    console.log('Finding matches for input:', input);
    console.log('Total addresses:', addresses.length);

    // Find addresses where input matches the street number
    const matches = addresses.filter(addr => {
      const streetNumber = addr.street.split(' ')[0];  // Get the first part of the address
      console.log('Checking address:', {
        street: addr.street,
        streetNumber,
        input
      });
      return streetNumber === input;
    });

    console.log('Found matches:', matches);

    if (matches.length === 1) {
      setMatchedAddress(matches[0]);
      setSuggestions([]);
      setError('');
    } else if (matches.length > 1) {
      setSuggestions(matches.slice(0, 5)); // Show top 5 matches
      setMatchedAddress(null);
      setError('');
    } else {
      setMatchedAddress(null);
      setSuggestions([]);
      setError('No matching address found');
    }
  };

  const handleAddressSelect = (address) => {
    setMatchedAddress(address);
    setSuggestions([]);
    setError('');
  };

  const handleNumberClick = (num) => {
    const newNumber = number + num;
    setNumber(newNumber);
    findMatchingAddress(newNumber);
  };

  const handleBackspace = () => {
    const newNumber = number.slice(0, -1);
    setNumber(newNumber);
    findMatchingAddress(newNumber);
  };

  const handleClear = () => {
    setNumber('');
    setMatchedAddress(null);
    setError('');
  };

  const handleCheckIn = async () => {
    if (!matchedAddress) {
      setError('Please enter a valid house number');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/checkins`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          street: matchedAddress.street
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to check in');
      }

      setSuccess('Successfully checked in!');
      setNumber('');
      setMatchedAddress(null);
      fetchCheckInCount();
    } catch (err) {
      setError(err.message);
    }
  };

  // Add a function to convert numbers to Chinese characters
  const toChineseNumber = (num) => {
    const chineseNums = {
      '0': '零',
      '1': '一',
      '2': '二',
      '3': '三',
      '4': '四',
      '5': '五',
      '6': '六',
      '7': '七',
      '8': '八',
      '9': '九'
    };
    return num.split('').map(digit => chineseNums[digit]).join('');
  };

  return (
    <Box sx={{ 
      p: 2, 
      maxWidth: '600px', 
      margin: '0 auto',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Box sx={{ 
        mb: 2,
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
        p: 2,
        borderRadius: 2,
        textAlign: 'center'
      }}>
        <Typography variant="h4" component="h1" sx={{ 
          color: '#2E7D32',
          fontFamily: 'Playfair Display',
          fontWeight: 700
        }}>
          <LocalShippingIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Farm Pickup Kiosk
        </Typography>
      </Box>

      <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
        {Object.entries(checkInsByDate)
          .sort((a, b) => new Date(b[0]) - new Date(a[0]))
          .slice(0, 2)
          .map(([date, checkIns]) => (
            <Chip 
              key={date}
              label={`${new Date(date).toLocaleDateString('en-US', { 
                weekday: 'short', 
                month: 'short', 
                day: 'numeric' 
              })}: ${checkIns.length} check-ins`}
              color="primary"
              sx={{ 
                fontSize: '1rem', 
                padding: '20px',
                backgroundColor: date === new Date().toLocaleDateString() ? '#4CAF50' : '#2196F3',
                color: 'white',
                '& .MuiChip-label': {
                  fontSize: '1.1rem',
                  fontWeight: 500
                }
              }}
            />
          ))}
      </Stack>

      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Box sx={{ mb: 3, textAlign: 'center' }}>
          <Typography variant="h3" sx={{ fontFamily: 'monospace' }}>
            {number || '0'}
          </Typography>
          <Typography variant="h4" sx={{ 
            color: '#2E7D32',
            mt: 1,
            fontFamily: 'monospace'
          }}>
            {number ? toChineseNumber(number) : '零'}
          </Typography>
        </Box>

        {suggestions.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 1, color: '#1976d2' }}>
              Matching Addresses:
            </Typography>
            {suggestions.map((addr, index) => (
              <Button
                key={addr.id}
                fullWidth
                variant="outlined"
                onClick={() => handleAddressSelect(addr)}
                sx={{ 
                  mb: 1,
                  justifyContent: 'flex-start',
                  textAlign: 'left',
                  height: '60px',
                  fontSize: '1.2rem',
                  borderColor: '#4CAF50',
                  color: '#2E7D32',
                  '&:hover': {
                    borderColor: '#2E7D32',
                    backgroundColor: 'rgba(46, 125, 50, 0.04)'
                  }
                }}
              >
                {addr.street}
              </Button>
            ))}
          </Box>
        )}

        {matchedAddress && (
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              label="Street"
              value={matchedAddress.street}
              variant="outlined"
              InputProps={{ readOnly: true }}
              sx={{ mb: 2, '& .MuiInputBase-input': { fontSize: '1.5rem' } }}
            />
            <TextField
              fullWidth
              label="Name"
              value={matchedAddress.name}
              variant="outlined"
              InputProps={{ readOnly: true }}
              sx={{ '& .MuiInputBase-input': { fontSize: '1.5rem' } }}
            />
          </Box>
        )}

        <Grid container spacing={2} sx={{ mb: 3 }}>
          {[
            { en: '1', zh: '一' },
            { en: '2', zh: '二' },
            { en: '3', zh: '三' },
            { en: '4', zh: '四' },
            { en: '5', zh: '五' },
            { en: '6', zh: '六' },
            { en: '7', zh: '七' },
            { en: '8', zh: '八' },
            { en: '9', zh: '九' },
            { en: '0', zh: '零' }
          ].map((num) => (
            <Grid item xs={4} key={num.en}>
              <Button
                fullWidth
                variant="contained"
                sx={{ 
                  height: '80px', 
                  fontSize: '2rem',
                  backgroundColor: '#4CAF50',
                  '&:hover': {
                    backgroundColor: '#45a049'
                  },
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '8px'
                }}
                onClick={() => handleNumberClick(num.en)}
              >
                <Box sx={{ fontSize: '2rem' }}>{num.en}</Box>
                <Box sx={{ fontSize: '1.2rem', mt: 0.5 }}>{num.zh}</Box>
              </Button>
            </Grid>
          ))}
          <Grid item xs={4}>
            <Button
              fullWidth
              variant="contained"
              color="secondary"
              sx={{ 
                height: '80px', 
                fontSize: '1.2rem',
                display: 'flex',
                flexDirection: 'column'
              }}
              onClick={handleClear}
            >
              Clear
              <Box sx={{ fontSize: '1rem', mt: 0.5 }}>清除</Box>
            </Button>
          </Grid>
          <Grid item xs={4}>
            <IconButton
              color="primary"
              sx={{ 
                height: '80px', 
                width: '100%',
                border: '1px solid #1976d2',
                display: 'flex',
                flexDirection: 'column'
              }}
              onClick={handleBackspace}
            >
              <BackspaceIcon sx={{ fontSize: '2rem' }} />
              <Box sx={{ fontSize: '0.8rem', mt: 0.5 }}>退格</Box>
            </IconButton>
          </Grid>
        </Grid>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <Button
          fullWidth
          variant="contained"
          color="primary"
          size="large"
          onClick={handleCheckIn}
          sx={{ 
            height: '80px',
            fontSize: '1.5rem',
            backgroundColor: '#2E7D32',
            '&:hover': {
              backgroundColor: '#1b5e20'
            }
          }}
        >
          Check In
        </Button>
      </Paper>
    </Box>
  );
}

export default KioskCheckIn; 