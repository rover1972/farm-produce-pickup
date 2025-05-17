import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  Chip,
  Autocomplete,
  Stack,
} from '@mui/material';
import axios from 'axios';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';

const API_URL = 'http://localhost:3000/api';

function CheckInForm() {
  const [formData, setFormData] = useState({
    identifier: '',
    notes: '',
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [validAddress, setValidAddress] = useState('');
  const [checkInsByDate, setCheckInsByDate] = useState({});
  const [names, setNames] = useState([]);
  const [streets, setStreets] = useState([]);
  const [nicknames, setNicknames] = useState([]);
  const [selectedName, setSelectedName] = useState(null);
  const [selectedStreet, setSelectedStreet] = useState(null);
  const [selectedNickname, setSelectedNickname] = useState(null);

  // Fetch check-in count and data on component mount
  useEffect(() => {
    fetchCheckInCount();
    fetchAddressData();
  }, []);

  const fetchAddressData = async () => {
    try {
      const response = await axios.get(`${API_URL}/addresses`);
      // Extract unique names
      const uniqueNames = [...new Set(response.data
        .map(addr => addr.name)
        .filter(name => name && name.trim() !== '')
      )].sort();
      
      // Extract unique streets
      const uniqueStreets = [...new Set(response.data
        .map(addr => addr.street)
        .filter(street => street && street.trim() !== '')
      )].sort();
      
      // Extract unique nicknames (otherNames)
      const uniqueNicknames = [...new Set(response.data
        .map(addr => addr.otherName)
        .filter(nickname => nickname && nickname.trim() !== '')
      )].sort();
      
      setNames(uniqueNames);
      setStreets(uniqueStreets);
      setNicknames(uniqueNicknames);
    } catch (error) {
      console.error('Error fetching address data:', error);
    }
  };

  // Fetch check-in count on component mount and after successful check-in
  const fetchCheckInCount = async () => {
    try {
      const response = await axios.get(`${API_URL}/checkins`);
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
      
      setCheckInsByDate(groupedCheckIns);
    } catch (error) {
      console.error('Error fetching check-in count:', error);
    }
  };

  const fetchCheckIns = async () => {
    try {
      const response = await axios.get(`${API_URL}/checkins`);
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
      
      setCheckInsByDate(groupedCheckIns);
    } catch (error) {
      console.error('Error fetching check-ins:', error);
    }
  };

  const validateAddress = async (input) => {
    if (!input) {
      setValidAddress('');
      setFormData(prev => ({ ...prev, notes: '' }));
      setError('');
      return;
    }

    try {
      // Get addresses and check-ins
      const [addressesResponse, checkInsResponse] = await Promise.all([
        axios.get(`${API_URL}/addresses`),
        axios.get(`${API_URL}/checkins`)
      ]);
      
      const addresses = addressesResponse.data;
      
      // Filter for active check-ins from today only
      const today = new Date().toLocaleDateString();
      const activeCheckIns = checkInsResponse.data.filter(checkIn => 
        checkIn.status === 'checked-in' && 
        new Date(checkIn.checkInTime).toLocaleDateString() === today
      );
      
      // Try to match by street
      const matchingByStreet = addresses.find(addr => addr.street === input);
      
      // Try to match by name
      const matchingByName = addresses.find(addr => addr.name === input);
      
      // Try to match by nickname (otherName)
      const matchingByNickname = addresses.find(addr => addr.otherName === input);

      const matchingAddress = matchingByStreet || matchingByName || matchingByNickname;

      if (matchingAddress) {
        // Check if this address already has an active check-in today
        const hasActiveCheckIn = activeCheckIns.some(checkIn => 
          checkIn.address === matchingAddress.street
        );

        if (hasActiveCheckIn) {
          setValidAddress('');
          setFormData(prev => ({ ...prev, notes: '' }));
          setError('This address already has an active check-in for today');
          return;
        }

        setValidAddress(matchingAddress.street);
        let verificationText = `Verified Address: ${matchingAddress.street}\n`;
        if (matchingAddress.name) verificationText += `Name: ${matchingAddress.name}\n`;
        if (matchingAddress.otherName) verificationText += `Other Name: ${matchingAddress.otherName}\n`;
        
        setFormData(prev => ({
          ...prev,
          notes: verificationText
        }));
        setError('');
      } else {
        setValidAddress('');
        setFormData(prev => ({
          ...prev,
          notes: ''
        }));
        setError('No matching address found for the given input');
      }
    } catch (error) {
      console.error('Error validating address:', error);
      setError('Failed to validate address');
    }
  };

  const handleNameChange = (event, newValue) => {
    setSelectedName(newValue);
    // Clear other fields
    setSelectedStreet(null);
    setSelectedNickname(null);
    if (newValue) {
      validateAddress(newValue);
      setFormData(prev => ({
        ...prev,
        identifier: newValue
      }));
    }
  };

  const handleStreetChange = (event, newValue) => {
    setSelectedStreet(newValue);
    // Clear other fields
    setSelectedName(null);
    setSelectedNickname(null);
    if (newValue) {
      validateAddress(newValue);
      setFormData(prev => ({
        ...prev,
        identifier: newValue
      }));
    }
  };

  const handleNicknameChange = (event, newValue) => {
    setSelectedNickname(newValue);
    // Clear other fields
    setSelectedName(null);
    setSelectedStreet(null);
    if (newValue) {
      validateAddress(newValue);
      setFormData(prev => ({
        ...prev,
        identifier: newValue
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`${API_URL}/checkins`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          street: validAddress
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to check in');
      }

      setSuccess('Successfully checked in!');
      setFormData({
        identifier: '',
        notes: ''
      });
      fetchCheckIns();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Box>
      <Box sx={{ 
        mb: 2,
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
        p: 2,
        borderRadius: 2,
      }}>
        <Typography variant="h4" component="h1" sx={{ color: '#2E7D32' }}>
          <LocalShippingIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Check In
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

      {success && (
        <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>
          {success}
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ 
        p: 3,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        border: '1px solid rgba(76, 175, 80, 0.2)',
      }}>
        <Box component="form" onSubmit={handleSubmit}>
          <Autocomplete
            fullWidth
            options={streets}
            value={selectedStreet}
            onChange={handleStreetChange}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Street"
                margin="normal"
                helperText="Select a street from the list"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: '#4CAF50',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#4CAF50',
                    },
                  },
                }}
              />
            )}
          />

          <Autocomplete
            fullWidth
            options={names}
            value={selectedName}
            onChange={handleNameChange}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Name"
                margin="normal"
                helperText="Select a name from the list"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: '#4CAF50',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#4CAF50',
                    },
                  },
                }}
              />
            )}
          />

          <Autocomplete
            fullWidth
            options={nicknames}
            value={selectedNickname}
            onChange={handleNicknameChange}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Nick Name"
                margin="normal"
                helperText="Select a nick name from the list (if available)"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: '#4CAF50',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#4CAF50',
                    },
                  },
                }}
              />
            )}
          />

          <TextField
            fullWidth
            label="Verification Details"
            name="notes"
            value={formData.notes}
            margin="normal"
            multiline
            rows={4}
            InputProps={{
              readOnly: true,
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'rgba(76, 175, 80, 0.05)',
                '&:hover fieldset': {
                  borderColor: '#4CAF50',
                },
              },
            }}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            sx={{ 
              mt: 2,
              backgroundColor: '#4CAF50',
              '&:hover': {
                backgroundColor: '#388E3C',
              },
            }}
            disabled={!validAddress}
          >
            Check In
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

export default CheckInForm; 