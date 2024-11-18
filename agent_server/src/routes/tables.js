const express = require('express');
const router = express.Router();
const { auth, checkRole } = require('../middleware/auth');
const Table = require('../models/Table');

// Get all tables
router.get('/', auth, async (req, res) => {
  try {
    const tables = await Table.find().populate('reservedBy', 'username email');
    res.json(tables);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create table (Admin only)
router.post('/', [auth, checkRole(['admin'])], async (req, res) => {
  try {
    const table = new Table(req.body);
    await table.save();
    res.status(201).json(table);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Reserve table
router.post('/:id/reserve', auth, async (req, res) => {
  try {
    const table = await Table.findById(req.params.id);
    if (!table) {
      return res.status(404).json({ message: 'Table not found' });
    }
    if (table.status !== 'available') {
      return res.status(400).json({ message: 'Table is not available' });
    }

    table.status = 'reserved';
    table.reservedBy = req.user.userId;
    table.reservationTime = req.body.reservationTime || new Date();
    await table.save();

    res.json(table);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update table status (Staff and Admin)
router.patch('/:id/status', [auth, checkRole(['admin', 'staff'])], async (req, res) => {
  try {
    const table = await Table.findById(req.params.id);
    if (!table) {
      return res.status(404).json({ message: 'Table not found' });
    }

    table.status = req.body.status;
    if (req.body.status === 'available') {
      table.reservedBy = null;
      table.reservationTime = null;
    }
    await table.save();

    res.json(table);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete table (Admin only)
router.delete('/:id', [auth, checkRole(['admin'])], async (req, res) => {
  try {
    const table = await Table.findByIdAndDelete(req.params.id);
    if (!table) {
      return res.status(404).json({ message: 'Table not found' });
    }
    res.json({ message: 'Table deleted' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});