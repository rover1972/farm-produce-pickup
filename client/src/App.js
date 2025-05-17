import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';

// Import components
import Navbar from './components/Navbar';
import AddressList from './components/AddressList';
import CheckInForm from './components/CheckInForm';
import CheckInList from './components/CheckInList';
import Dashboard from './components/Dashboard';
import KioskCheckIn from './components/KioskCheckIn';

// Create farm-themed theme
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#4CAF50', // Farm green
      light: '#81C784',
      dark: '#388E3C',
    },
    secondary: {
      main: '#FFA000', // Harvest orange
      light: '#FFB74D',
      dark: '#F57C00',
    },
    background: {
      default: '#F5F5F5',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#2E7D32', // Dark green
      secondary: '#5D4037', // Brown
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontFamily: '"Playfair Display", serif',
      color: '#2E7D32',
    },
    h2: {
      fontFamily: '"Playfair Display", serif',
      color: '#2E7D32',
    },
    h3: {
      fontFamily: '"Playfair Display", serif',
      color: '#2E7D32',
    },
    h4: {
      fontFamily: '"Playfair Display", serif',
      color: '#2E7D32',
    },
    h5: {
      fontFamily: '"Playfair Display", serif',
      color: '#2E7D32',
    },
    h6: {
      fontFamily: '"Playfair Display", serif',
      color: '#2E7D32',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 2px 4px rgba(0,0,0,0.2)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0px 4px 8px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, rgba(76,175,80,0.1) 0%, rgba(255,255,255,0.8) 100%)',
        }}>
          <Navbar />
          <Box sx={{ p: 3 }}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/addresses" element={<AddressList />} />
              <Route path="/checkin" element={<CheckInForm />} />
              <Route path="/checkins" element={<CheckInList />} />
              <Route path="/kiosk" element={<KioskCheckIn />} />
            </Routes>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
