const express = require('express');
const router = express.Router();
const sheetService = require('../services/sheetService');

// Get all check-ins
router.get('/', async (req, res) => {
  try {
    const checkIns = await sheetService.getCheckIns();
    // Sort check-ins by check-in time, most recent first
    const sortedCheckIns = checkIns.sort((a, b) => {
      return new Date(b.checkInTime) - new Date(a.checkInTime);
    });
    res.json(sortedCheckIns);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single check-in
router.get('/:id', async (req, res) => {
  try {
    const checkIn = await sheetService.getCheckIn(req.params.id);
    if (!checkIn) {
      return res.status(404).json({ message: 'Check-in not found' });
    }
    const address = await sheetService.getAddress(checkIn.addressId);
    res.json({ ...checkIn, address });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new check-in
router.post('/', async (req, res) => {
  try {
    const newCheckIn = await sheetService.createCheckIn(req.body);
    const address = await sheetService.getAddress(newCheckIn.addressId);
    res.status(201).json({ ...newCheckIn, address });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update check-in status (check-out)
router.patch('/:id/checkout', async (req, res) => {
  try {
    const updatedCheckIn = await sheetService.updateCheckInStatus(req.params.id, 'checked-out');
    if (!updatedCheckIn) {
      return res.status(404).json({ message: 'Check-in not found' });
    }
    const address = await sheetService.getAddress(updatedCheckIn.addressId);
    res.json({ ...updatedCheckIn, address });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Cancel check-in
router.patch('/:id/cancel', async (req, res) => {
  try {
    const updatedCheckIn = await sheetService.updateCheckInStatus(req.params.id, 'cancelled');
    if (!updatedCheckIn) {
      return res.status(404).json({ message: 'Check-in not found' });
    }
    const address = await sheetService.getAddress(updatedCheckIn.addressId);
    res.json({ ...updatedCheckIn, address });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router; 