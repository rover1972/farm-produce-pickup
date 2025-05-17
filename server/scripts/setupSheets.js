const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');
require('dotenv').config();

async function setupSheets() {
  try {
    console.log('Setting up Google Sheets...');

    // Initialize auth with JWT
    const serviceAccountAuth = new JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    // Create a new document with auth
    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID, serviceAccountAuth);
    await doc.loadInfo();

    // Set up Addresses sheet
    console.log('Setting up Addresses sheet...');
    let addressesSheet = doc.sheetsByTitle['Addresses'];
    if (!addressesSheet) {
      addressesSheet = await doc.addSheet({ title: 'Addresses' });
    }
    await addressesSheet.setHeaderRow([
      'id',
      'street',
      'city',
      'state',
      'zipCode',
      'country',
      'isActive'
    ]);

    // Set up CheckIns sheet
    console.log('Setting up CheckIns sheet...');
    let checkInsSheet = doc.sheetsByTitle['CheckIns'];
    if (!checkInsSheet) {
      checkInsSheet = await doc.addSheet({ title: 'CheckIns' });
    }
    await checkInsSheet.setHeaderRow([
      'id',
      'addressId',
      'customerName',
      'customerEmail',
      'customerPhone',
      'checkInTime',
      'checkOutTime',
      'status',
      'notes'
    ]);

    console.log('Sheets setup completed successfully!');
  } catch (error) {
    console.error('Error setting up sheets:', error);
  }
}

// Run the setup
setupSheets(); 