const express = require('express');
const router = express.Router();
const { auth, checkRole } = require('../middleware/auth');
const bankStaffController = require('../controllers/bankStaffController');
const agencyController = require('../controllers/agencyController');
const Bank = require('../models/Bank');
const Agency = require('../models/Agency');
const Role = require('../models/Role');

// Bank Management
router.post('/banks', auth, checkRole(['super_admin']), async (req, res) => {
  try {
    const bank = await Bank.create(req.body);
    res.status(201).json(bank);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/banks', auth, checkRole(['super_admin']), async (req, res) => {
  try {
    const banks = await Bank.findAll();
    res.json(banks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Bank Staff Management
router.get('/banks/:bankId/staff', auth, checkRole(['super_admin', 'bank_admin']), bankStaffController.getBankStaff);
router.post('/banks/:bankId/staff', auth, checkRole(['super_admin', 'bank_admin']), bankStaffController.createBankStaff);
router.put('/banks/:bankId/staff/:staffId', auth, checkRole(['super_admin', 'bank_admin']), bankStaffController.updateBankStaff);
router.delete('/banks/:bankId/staff/:staffId', auth, checkRole(['super_admin', 'bank_admin']), bankStaffController.deleteBankStaff);
router.put('/banks/:bankId/staff/:staffId/roles', auth, checkRole(['super_admin', 'bank_admin']), bankStaffController.updateStaffRoles);

// Agency Management
router.post('/banks/:bankId/agencies', auth, checkRole(['super_admin']), agencyController.createAgency);
router.get('/banks/:bankId/agencies', auth, checkRole(['super_admin']), agencyController.getAgencies);
router.put('/banks/:bankId/agencies/:agencyId', auth, checkRole(['super_admin']), agencyController.updateAgency);
router.delete('/banks/:bankId/agencies/:agencyId', auth, checkRole(['super_admin']), agencyController.deleteAgency);

// Agency Staff Management
router.post('/banks/:bankId/agencies/:agencyId/staff', auth, checkRole(['super_admin', 'agency_admin']), agencyController.createAgencyStaff);
router.get('/banks/:bankId/agencies/:agencyId/staff', auth, checkRole(['super_admin', 'agency_admin']), agencyController.getAgencyStaff);

module.exports = router;