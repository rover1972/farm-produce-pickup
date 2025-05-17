const sheetService = require('../services/sheetService');

async function seedData() {
  try {
    console.log('Starting to seed data...');
    
    // Initialize the sheet service
    console.log('Initializing sheet service...');
    await sheetService.initialize();

    // Add sample addresses
    const addresses = [
      {
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA',
        isActive: true
      },
      {
        street: '456 Oak Ave',
        city: 'Los Angeles',
        state: 'CA',
        zipCode: '90001',
        country: 'USA',
        isActive: true
      },
      {
        street: '789 Pine Rd',
        city: 'Chicago',
        state: 'IL',
        zipCode: '60601',
        country: 'USA',
        isActive: true
      }
    ];

    console.log('Adding sample addresses...');
    for (const address of addresses) {
      await sheetService.createAddress(address);
    }

    // Add sample check-ins
    const checkIns = [
      {
        addressId: '1', // This will be updated with the actual address ID
        customerName: 'John Doe',
        customerEmail: 'john@example.com',
        customerPhone: '555-0123',
        checkInTime: new Date().toISOString(),
        status: 'checked-in'
      },
      {
        addressId: '2', // This will be updated with the actual address ID
        customerName: 'Jane Smith',
        customerEmail: 'jane@example.com',
        customerPhone: '555-0124',
        checkInTime: new Date().toISOString(),
        status: 'checked-in'
      }
    ];

    console.log('Adding sample check-ins...');
    for (const checkIn of checkIns) {
      await sheetService.createCheckIn(checkIn);
    }

    console.log('Data seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding data:', error);
  }
}

// Run the seeding function
seedData(); 