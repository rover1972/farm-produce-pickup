import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
} from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import DashboardIcon from '@mui/icons-material/Dashboard';
import GrassIcon from '@mui/icons-material/Grass';
import ListIcon from '@mui/icons-material/List';

function Navbar() {
  return (
    <AppBar 
      position="static" 
      sx={{ 
        background: 'linear-gradient(45deg, #4CAF50 30%, #388E3C 90%)',
        boxShadow: '0 3px 5px 2px rgba(76, 175, 80, .3)',
      }}
    >
      <Toolbar>
        <GrassIcon sx={{ mr: 1 }} />
        <Typography 
          variant="h6" 
          component={RouterLink} 
          to="/" 
          sx={{ 
            flexGrow: 1, 
            textDecoration: 'none', 
            color: 'inherit',
            fontFamily: 'Playfair Display',
            fontWeight: 700,
          }}
        >
          Farm Pickup Check-in
        </Typography>
        <Box sx={{ '& > :not(:last-child)': { mr: 2 } }}>
          <Button
            color="inherit"
            component={RouterLink}
            to="/"
            startIcon={<DashboardIcon />}
            sx={{ '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' } }}
          >
            Dashboard
          </Button>
          <Button
            color="inherit"
            component={RouterLink}
            to="/addresses"
            startIcon={<ListIcon />}
            sx={{ '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' } }}
          >
            Addresses
          </Button>
          <Button
            color="inherit"
            component={RouterLink}
            to="/checkin"
            startIcon={<LoginIcon />}
            sx={{ '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' } }}
          >
            Check In
          </Button>
          <Button
            color="inherit"
            component={RouterLink}
            to="/checkins"
            startIcon={<LocalShippingIcon />}
            sx={{ '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' } }}
          >
            View Check-ins
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar; 