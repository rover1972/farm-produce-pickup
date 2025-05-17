const mongoose = require('mongoose');

const checkInSchema = new mongoose.Schema({
  address: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Address',
    required: true
  },
  customerName: {
    type: String,
    required: true,
    trim: true
  },
  customerEmail: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  customerPhone: {
    type: String,
    required: true,
    trim: true
  },
  checkInTime: {
    type: Date,
    default: Date.now
  },
  checkOutTime: {
    type: Date
  },
  status: {
    type: String,
    enum: ['checked-in', 'checked-out', 'cancelled'],
    default: 'checked-in'
  },
  notes: {
    type: String,
    trim: true
  }
});

module.exports = mongoose.model('CheckIn', checkInSchema); 