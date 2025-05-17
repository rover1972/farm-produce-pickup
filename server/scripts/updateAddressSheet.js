const sheetService = require('../services/sheetService');

async function updateAddressSheet() {
  try {
    console.log('Initializing sheet service...');
    await sheetService.initialize();

    console.log('Getting addresses sheet...');
    const addressesSheet = sheetService.addressesSheet;

    // Get existing data
    const rows = await addressesSheet.getRows();
    const existingData = rows.map(row => ({
      id: row.get('id'),
      street: row.get('street'),
      isActive: row.get('isActive')
    }));

    // Clear the sheet
    await Promise.all(rows.map(row => row.delete()));

    // Set new header row
    await addressesSheet.setHeaderRow([
      'id',
      'street',
      'name',
      'otherName',
      'isActive'
    ]);

    // Add back the data with new structure
    for (const data of existingData) {
      await addressesSheet.addRow({
        ...data,
        name: '',
        otherName: ''
      });
    }

    console.log('Successfully updated address sheet structure!');
  } catch (error) {
    console.error('Error updating address sheet:', error);
  }
}

updateAddressSheet(); 