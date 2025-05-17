const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const sheetService = require('./server/services/sheetService');

// Load environment variables
dotenv.config();

let mainWindow;
let serverProcess;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  // Start the server
  const server = express();
  server.use(cors());
  server.use(express.json());

  // Initialize Google Sheets
  sheetService.initialize()
    .then(() => {
      console.log('Connected to Google Sheets');
      
      // Import routes
      const addressRoutes = require('./server/routes/addresses');
      const checkInRoutes = require('./server/routes/checkIns');

      // Routes
      server.use('/api/addresses', addressRoutes);
      server.use('/api/checkins', checkInRoutes);

      // Serve static files from the React app
      server.use(express.static(path.join(__dirname, 'client/build')));
      
      // Handle React routing, return all requests to React app
      server.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
      });

      // Start server
      const PORT = process.env.PORT || 3000;
      server.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
        // Load the React app
        mainWindow.loadURL('http://localhost:3000');
      });
    })
    .catch(err => {
      console.error('Google Sheets connection error:', err);
      app.quit();
    });

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});

app.on('before-quit', () => {
  if (serverProcess) {
    serverProcess.kill();
  }
}); 