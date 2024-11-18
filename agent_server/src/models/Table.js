const mongoose = require('mongoose');

const tableSchema = new mongoose.Schema({
  number: { type: Number, required: true, unique: true },
  capacity: { type: Number, required: true },
  status: { type: String, enum: ['available', 'occupied', 'reserved'], default: 'available' },
  reservedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  reservationTime: Date
});

module.exports = mongoose.model('Table', tableSchema);