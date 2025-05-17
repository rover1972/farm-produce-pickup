const sheetService = require('../services/sheetService');

async function cleanCheckIns() {
  try {
    console.log('Initializing sheet service...');
    await sheetService.initialize();

    console.log('Getting check-ins sheet...');
    const rows = await sheetService.checkInsSheet.getRows();
    
    console.log(`Found ${rows.length} check-ins to delete...`);
    
    // Delete all rows
    for (const row of rows) {
      await row.delete();
    }

    console.log('Successfully deleted all check-ins!');
  } catch (error) {
    console.error('Error cleaning check-ins:', error);
  }
}

cleanCheckIns(); 