const sheetService = require('../services/sheetService');

async function updateCheckInSheet() {
  try {
    console.log('Initializing sheet service...');
    await sheetService.initialize();

    console.log('Getting check-ins sheet...');
    const checkInsSheet = sheetService.checkInsSheet;

    // Get all rows
    const rows = await checkInsSheet.getRows();
    console.log(`Found ${rows.length} check-ins...`);

    // Define the new headers with name column after id
    const newHeaders = ['id', 'name', 'identifier', 'address', 'addressId', 'notes', 'checkInTime', 'checkOutTime', 'status'];

    // Update sheet headers
    await checkInsSheet.setHeaderRow(newHeaders);
    console.log('Updated sheet headers');

    // For each existing row, create a new row with only the fields we want
    for (const row of rows) {
      const newRowData = {};
      newHeaders.forEach(header => {
        newRowData[header] = row.get(header) || '';
      });
      await checkInsSheet.addRow(newRowData);
      await row.delete();
    }

    console.log('Successfully updated check-in sheet structure!');
  } catch (error) {
    console.error('Error updating check-in sheet:', error);
  }
}

updateCheckInSheet(); 