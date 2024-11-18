const express = require('express');
const router = express.Router();
const { auth, checkRole } = require('../middleware/auth');
const User = require('../models/User');
const Bank = require('../models/Bank');
const Agent = require('../models/Agent');
const Role = require('../models/Role');

// Create bank
router.post('/banks', auth, checkRole(['super_admin']), async (req, res) => {
  try {
    const bank = await Bank.create(req.body);
    res.status(201).json(bank);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Create agent
router.post('/agents', auth, checkRole(['super_admin']), async (req, res) => {
  try {
    const agent = await Agent.create(req.body);
    res.status(201).json(agent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Create bank staff
router.post('/bank-staff', auth, checkRole(['super_admin', 'bank_admin']), async (req, res) => {
  try {
    const bankStaffRole = await Role.findOne({ where: { name: 'bank_staff' } });
    const user = await User.create({
      ...req.body,
      roleId: bankStaffRole.id
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Create agent staff
router.post('/agent-staff', auth, checkRole(['super_admin', 'agent_admin']), async (req, res) => {
  try {
    const agentStaffRole = await Role.findOne({ where: { name: 'agent_staff' } });
    const user = await User.create({
      ...req.body,
      roleId: agentStaffRole.id
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all banks
router.get('/banks', auth, checkRole(['super_admin']), async (req, res) => {
  try {
    const banks = await Bank.findAll();
    res.json(banks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all agents
router.get('/agents', auth, checkRole(['super_admin']), async (req, res) => {
  try {
    const agents = await Agent.findAll();
    res.json(agents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;