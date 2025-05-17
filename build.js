const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Build the React frontend
console.log('Building React frontend...');
execSync('cd client && npm run build', { stdio: 'inherit' });

// Copy the build folder to the server directory
console.log('Copying build folder to server...');
const buildDir = path.join(__dirname, 'client', 'build');
const serverBuildDir = path.join(__dirname, 'server', 'build');

if (!fs.existsSync(serverBuildDir)) {
  fs.mkdirSync(serverBuildDir, { recursive: true });
}

// Copy all files from client/build to server/build
fs.cpSync(buildDir, serverBuildDir, { recursive: true });

// Install pkg if not already installed
console.log('Installing pkg...');
execSync('npm install -g pkg', { stdio: 'inherit' });

// Create executable
console.log('Creating executable...');
execSync('cd server && pkg . --targets node18-macos-x64,node18-linux-x64,node18-win-x64 --output ../pickup-checkin', { stdio: 'inherit' });

console.log('Build complete! The executable is available as "pickup-checkin"'); 