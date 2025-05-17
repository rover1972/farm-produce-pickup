const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Build the React frontend
console.log('Building React frontend...');
execSync('cd client && npm run build', { stdio: 'inherit' });

// Install dependencies
console.log('Installing dependencies...');
execSync('npm install', { stdio: 'inherit' });

// Create build directory if it doesn't exist
const buildDir = path.join(__dirname, 'build');
if (!fs.existsSync(buildDir)) {
  fs.mkdirSync(buildDir);
}

// Create a simple icon (you can replace this with your own icon)
console.log('Creating app icon...');
// Note: You'll need to add your own icon.icns file to the build directory

// Build the app
console.log('Building macOS app...');
execSync('npm run dist', { stdio: 'inherit' });

console.log('Build complete! The app is available in the dist directory.'); 