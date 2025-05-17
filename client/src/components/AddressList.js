import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
} from '@mui/material';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://farm-produce-pickup.vercel.app';

function AddressList() {
  const [addresses, setAddresses] = useState([]);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');
  const [newAddress, setNewAddress] = useState({
    street: '',
    name: '',
    otherName: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'USA',
  });

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const response = await axios.get(`${API_URL}/addresses`);
      setAddresses(response.data);
      setError('');
    } catch (error) {
      console.error('Error fetching addresses:', error);
      setError('Failed to load addresses');
    }
  };

  const handleOpen = () => {
    setOpen(true);
    setError('');
  };
  
  const handleClose = () => {
    setOpen(false);
    setError('');
  };

  const handleChange = (e) => {
    setNewAddress({
      ...newAddress,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/addresses`, newAddress);
      fetchAddresses();
      handleClose();
      setNewAddress({
        street: '',
        name: '',
        otherName: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'USA',
      });
      setError('');
    } catch (error) {
      console.error('Error creating address:', error);
      setError(error.response?.data?.message || 'Failed to create address');
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography 
          variant="h4" 
          component="h1"
          sx={{ 
            color: '#2E7D32',
            fontFamily: 'Playfair Display',
            fontWeight: 700,
          }}
        >
          Pickup Addresses
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleOpen}
          sx={{
            backgroundColor: '#4CAF50',
            '&:hover': {
              backgroundColor: '#388E3C',
            },
          }}
        >
          Add New Address
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {addresses.map((address) => (
          <Grid item xs={12} sm={6} md={4} key={address.id}>
            <Card 
              sx={{ 
                height: '100%',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                border: '1px solid rgba(76, 175, 80, 0.2)',
                borderRadius: 2,
              }}
            >
              <CardContent>
                <Typography 
                  variant="h6" 
                  gutterBottom
                  sx={{ 
                    color: '#2E7D32',
                    fontFamily: 'Playfair Display',
                  }}
                >
                  {address.street}
                </Typography>
                {address.name && (
                  <Typography color="textSecondary" gutterBottom>
                    Name: {address.name}
                  </Typography>
                )}
                {address.otherName && (
                  <Typography color="textSecondary" gutterBottom>
                    Other Name: {address.otherName}
                  </Typography>
                )}
                <Typography color="textSecondary">
                  {address.city}, {address.state} {address.zipCode}
                </Typography>
                <Typography color="textSecondary">
                  {address.country}
                </Typography>
                <Typography 
                  color="textSecondary"
                  sx={{
                    mt: 1,
                    color: address.isActive ? '#4CAF50' : '#F44336',
                  }}
                >
                  Status: {address.isActive ? 'Active' : 'Inactive'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog 
        open={open} 
        onClose={handleClose}
        PaperProps={{
          sx: {
            borderRadius: 2,
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
          }
        }}
      >
        <DialogTitle 
          sx={{ 
            color: '#2E7D32',
            fontFamily: 'Playfair Display',
            fontWeight: 700,
          }}
        >
          Add New Address
        </DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Street"
              name="street"
              value={newAddress.street}
              onChange={handleChange}
              margin="normal"
              required
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
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={newAddress.name}
              onChange={handleChange}
              margin="normal"
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
            <TextField
              fullWidth
              label="Other Name"
              name="otherName"
              value={newAddress.otherName}
              onChange={handleChange}
              margin="normal"
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
            <TextField
              fullWidth
              label="City"
              name="city"
              value={newAddress.city}
              onChange={handleChange}
              margin="normal"
              required
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
            <TextField
              fullWidth
              label="State"
              name="state"
              value={newAddress.state}
              onChange={handleChange}
              margin="normal"
              required
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
            <TextField
              fullWidth
              label="ZIP Code"
              name="zipCode"
              value={newAddress.zipCode}
              onChange={handleChange}
              margin="normal"
              required
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
            <TextField
              fullWidth
              label="Country"
              name="country"
              value={newAddress.country}
              onChange={handleChange}
              margin="normal"
              required
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
          </Box>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleClose}
            sx={{
              color: '#4CAF50',
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            color="primary"
            sx={{
              backgroundColor: '#4CAF50',
              '&:hover': {
                backgroundColor: '#388E3C',
              },
            }}
          >
            Add Address
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default AddressList; 