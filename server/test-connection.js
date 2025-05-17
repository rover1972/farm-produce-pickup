const sheetService = require('./services/sheetService');

async function testConnection() {
  try {
    console.log('Initializing Google Sheets connection...');
    await sheetService.initialize();
    console.log('Successfully connected to Google Sheets!');

    // Test reading addresses
    console.log('\nTesting address sheet...');
    const addresses = await sheetService.getAddresses();
    console.log('Successfully read addresses:', addresses.length);

    // Test reading check-ins
    console.log('\nTesting check-ins sheet...');
    const checkIns = await sheetService.getCheckIns();
    console.log('Successfully read check-ins:', checkIns.length);

    console.log('\nAll tests passed successfully!');
  } catch (error) {
    console.error('Error testing connection:', error);
  }
}

// Run the test
testConnection(); 