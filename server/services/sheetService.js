const { init } = require('../config/googleSheets');

class SheetService {
  constructor() {
    this.doc = null;
    this.addressesSheet = null;
    this.checkInsSheet = null;
  }

  async initialize() {
    try {
      console.log('Initializing Google Sheets connection...');
      this.doc = await init();
      console.log('Successfully connected to Google Sheets document');
      
      console.log('Getting Addresses sheet...');
      this.addressesSheet = this.doc.sheetsByTitle['Addresses'];
      if (!this.addressesSheet) {
        throw new Error('Addresses sheet not found');
      }
      console.log('Successfully got Addresses sheet');
      
      console.log('Getting CheckIns sheet...');
      this.checkInsSheet = this.doc.sheetsByTitle['CheckIns'];
      if (!this.checkInsSheet) {
        throw new Error('CheckIns sheet not found');
      }
      console.log('Successfully got CheckIns sheet');
      
      console.log('Sheet service initialization complete');
    } catch (error) {
      console.error('Error during sheet service initialization:', error);
      throw error;
    }
  }

  // Address operations
  async getAddresses() {
    try {
      console.log('Getting addresses from sheet...');
      const rows = await this.addressesSheet.getRows();
      console.log(`Found ${rows.length} addresses`);
      
      const addresses = rows.map(row => ({
        id: row.get('id'),
        street: row.get('street'),
        name: row.get('name') || '',
        otherName: row.get('otherName') || '',
        isActive: true // Force all addresses to be active
      }));
      
      console.log('Processed addresses:', addresses);
      return addresses;
    } catch (error) {
      console.error('Error getting addresses:', error);
      throw error;
    }
  }

  async getAddress(id) {
    const rows = await this.addressesSheet.getRows();
    const address = rows.find(row => row.get('id') === id);
    if (!address) return null;
    return {
      id: address.get('id'),
      street: address.get('street'),
      name: address.get('name') || '',
      otherName: address.get('otherName') || '',
      isActive: address.get('isActive') === 'true'
    };
  }

  async createAddress(address) {
    const id = Date.now().toString();
    await this.addressesSheet.addRow({
      id,
      street: address.street,
      name: address.name || '',
      otherName: address.otherName || '',
      isActive: 'true'
    });
    return { 
      id, 
      street: address.street,
      name: address.name || '',
      otherName: address.otherName || '',
      isActive: true 
    };
  }

  async updateAddress(id, updates) {
    const rows = await this.addressesSheet.getRows();
    const row = rows.find(row => row.get('id') === id);
    if (!row) return null;

    Object.keys(updates).forEach(key => {
      row.set(key, updates[key].toString());
    });
    await row.save();

    return {
      id,
      street: row.get('street'),
      name: row.get('name') || '',
      otherName: row.get('otherName') || '',
      isActive: row.get('isActive') === 'true'
    };
  }

  async deleteAddress(id) {
    return this.updateAddress(id, { isActive: false });
  }

  // Check-in operations
  async getCheckIns() {
    const rows = await this.checkInsSheet.getRows();
    
    return rows
      .filter(row => row.get('status') === 'checked-in')
      .map(row => ({
        id: row.get('id'),
        name: row.get('name'),
        notes: row.get('notes'),
        identifier: row.get('identifier'),
        addressId: row.get('addressId'),
        address: row.get('address'),
        checkInTime: row.get('checkInTime'),
        checkOutTime: row.get('checkOutTime'),
        status: row.get('status')
      }));
  }

  async getCheckIn(id) {
    const rows = await this.checkInsSheet.getRows();
    const checkIn = rows.find(row => row.get('id') === id);
    if (!checkIn) return null;
    return {
      id: checkIn.get('id'),
      identifier: checkIn.get('identifier'),
      addressId: checkIn.get('addressId'),
      address: checkIn.get('address'),
      notes: checkIn.get('notes'),
      checkInTime: checkIn.get('checkInTime'),
      checkOutTime: checkIn.get('checkOutTime'),
      status: checkIn.get('status')
    };
  }

  // Helper function to extract street number from address
  extractStreetNumber(street) {
    const match = street.match(/^\d+/);
    return match ? match[0] : null;
  }

  // Validate input against addresses
  async validateInput(input) {
    try {
      const addresses = await this.getAddresses();
      const normalizedInput = (input || '').toLowerCase().trim();
      console.log('\n=== Starting Validation ===');
      console.log('Input for validation:', input);
      console.log('Normalized input:', normalizedInput);
      console.log('Number of addresses to check:', addresses.length);
      
      // Check each address's fields
      for (const address of addresses) {
        const normalizedName = (address.name || '').toLowerCase().trim();
        const normalizedOtherName = (address.otherName || '').toLowerCase().trim();
        const normalizedStreet = (address.street || '').toLowerCase().trim();
        
        console.log('\nChecking address:', {
          street: address.street,
          name: address.name,
          otherName: address.otherName,
          normalizedName,
          normalizedOtherName,
          normalizedStreet,
          input: normalizedInput
        });
        
        // Check for exact match with street
        if (normalizedStreet === normalizedInput) {
          console.log('✅ Matched exactly by street:', address);
          return { valid: true, address };
        }
        
        // Check for exact match with name
        if (normalizedName === normalizedInput) {
          console.log('✅ Matched exactly by name:', address);
          return { valid: true, address };
        }
        
        // Check for partial match with name
        if (normalizedName && normalizedName.includes(normalizedInput)) {
          console.log('✅ Matched as substring of name:', address);
          return { valid: true, address };
        }
        
        // Check for exact match with otherName
        if (normalizedOtherName === normalizedInput) {
          console.log('✅ Matched exactly by otherName:', address);
          return { valid: true, address };
        }
        
        // Check for partial match with otherName
        if (normalizedOtherName && normalizedOtherName.includes(normalizedInput)) {
          console.log('✅ Matched as substring of otherName:', address);
          return { valid: true, address };
        }
      }

      console.log('\n❌ No match found for input:', input);
      return { valid: false, address: null };
    } catch (error) {
      console.error('\n❌ Error in validateInput:', error);
      throw new Error('Failed to validate address: ' + error.message);
    }
  }

  async createCheckIn(checkIn) {
    try {
      const id = Date.now().toString();
      
      // Step 1: Validate input against the addresses sheet
      const { valid, address } = await this.validateInput(checkIn.street);
      if (!valid || !address) {
        throw new Error('No matching address found for the given input');
      }

      // Step 2: Check if this address already has a check-in for today
      const rows = await this.checkInsSheet.getRows();
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Set to start of day for comparison
      
      console.log('Checking for existing check-ins...');
      console.log('Today\'s date:', today.toISOString());
      console.log('Address to check:', address.street);
      
      // Filter for only active check-ins for this specific address
      const addressCheckIns = rows.filter(row => {
        const checkInDate = new Date(row.get('checkInTime'));
        checkInDate.setHours(0, 0, 0, 0); // Set to start of day for comparison
        
        const isSameAddress = row.get('addressId') === address.id || 
                            row.get('address').toLowerCase() === address.street.toLowerCase();
        const isToday = checkInDate.getTime() === today.getTime();
        const isCheckedIn = row.get('status') === 'checked-in';
        
        console.log('Checking check-in:', {
          address: row.get('address'),
          addressId: row.get('addressId'),
          checkInDate: checkInDate.toISOString(),
          status: row.get('status'),
          isSameAddress,
          isToday,
          isCheckedIn
        });
        
        return isSameAddress && isToday && isCheckedIn;
      });
      
      console.log('Active check-ins for this address today:', addressCheckIns.length);
      
      if (addressCheckIns.length > 0) {
        throw new Error(`This address (${address.street}) already has a check-in for today. Only one check-in per address per day is allowed.`);
      }

      // Create the new check-in
      let verificationDetails = `Street: ${address.street}\n`;
      verificationDetails += `Name: ${address.name || ''}\n`;
      if (address.otherName) {
        verificationDetails += `Other Name: ${address.otherName}\n`;
      }

      const newCheckIn = {
        id,
        name: address.name || address.otherName || '',
        notes: verificationDetails,
        identifier: checkIn.identifier || '',
        addressId: address.id,
        address: address.street,
        checkInTime: new Date().toISOString(),
        status: 'checked-in'
      };
      
      await this.checkInsSheet.addRow(newCheckIn);
      return newCheckIn;
   
    } catch (error) {
      console.error('Error in createCheckIn:', error);
      throw error;
    }
  }

  async updateCheckInStatus(id, status) {
    const rows = await this.checkInsSheet.getRows();
    const row = rows.find(row => row.get('id') === id);
    if (!row) return null;

    const updates = {
      status,
      ...(status === 'checked-out' && { checkOutTime: new Date().toISOString() })
    };

    Object.keys(updates).forEach(key => {
      row.set(key, updates[key].toString());
    });
    await row.save();

    return {
      id,
      customerName: row.get('customerName'),
      notes: row.get('notes'),
      identifier: row.get('identifier'),
      addressId: row.get('addressId'),
      address: row.get('address'),
      checkInTime: row.get('checkInTime'),
      checkOutTime: row.get('checkOutTime'),
      status: row.get('status')
    };
  }
}

module.exports = new SheetService(); 