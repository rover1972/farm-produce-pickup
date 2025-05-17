const express = require('express');
const router = express.Router();
const sheetService = require('../services/sheetService');

// Get all addresses
router.get('/', async (req, res) => {
  try {
    const addresses = await sheetService.getAddresses();
    res.json(addresses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single address
router.get('/:id', async (req, res) => {
  try {
    const address = await sheetService.getAddress(req.params.id);
    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }
    res.json(address);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new address
router.post('/', async (req, res) => {
  try {
    const newAddress = await sheetService.createAddress(req.body);
    res.status(201).json(newAddress);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update an address
router.patch('/:id', async (req, res) => {
  try {
    const updatedAddress = await sheetService.updateAddress(req.params.id, req.body);
    if (!updatedAddress) {
      return res.status(404).json({ message: 'Address not found' });
    }
    res.json(updatedAddress);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete an address (soft delete)
router.delete('/:id', async (req, res) => {
  try {
    const deletedAddress = await sheetService.deleteAddress(req.params.id);
    if (!deletedAddress) {
      return res.status(404).json({ message: 'Address not found' });
    }
    res.json({ message: 'Address deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 