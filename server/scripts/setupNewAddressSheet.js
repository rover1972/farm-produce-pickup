const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');
require('dotenv').config();

async function setupNewAddressSheet() {
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

    // Set up new Addresses sheet
    console.log('Setting up new Addresses sheet...');
    let newAddressesSheet = await doc.addSheet({ 
      title: 'NewAddresses',
      headerValues: [
        'id',
        'street',
        'name',
        'otherName',
        'isActive'
      ]
    });

    console.log('New address sheet created with title: NewAddresses');
    console.log('Please manually copy your address data to the new sheet.');
    console.log('After copying, you can rename NewAddresses to Addresses');
  } catch (error) {
    console.error('Error setting up new address sheet:', error);
  }
}

setupNewAddressSheet(); 