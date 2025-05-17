const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const sheetService = require('./services/sheetService');
const path = require('path');

// Import routes
const addressRoutes = require('./routes/addresses');
const checkInRoutes = require('./routes/checkIns');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://farm-produce-pickup.vercel.app',
    'https://farm-produce-pickup-6jt1.vercel.app'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true
}));
app.use(express.json());

// Initialize Google Sheets
sheetService.initialize()
  .then(() => console.log('Connected to Google Sheets'))
  .catch(err => console.error('Google Sheets connection error:', err));

// Routes
app.use('/api/addresses', addressRoutes);
app.use('/api/checkins', checkInRoutes);

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Pickup Check-in API' });
});

// Serve static files from the React app in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  
  // Handle React routing, return all requests to React app
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Export the Express app for Vercel
module.exports = app;

// Only start the server if we're not in a serverless environment
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
} 