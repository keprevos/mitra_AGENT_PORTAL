const express = require('express');
const router = express.Router();
const { auth, checkRole } = require('../middleware/auth');
const bankStaffController = require('../controllers/bankStaffController');

// Add staff to bank
router.post(
  '/:bankId/staff',
  auth,
  checkRole(['super_admin', 'bank_admin']),
  bankStaffController.addStaff
);

// Get all staff for bank
router.get(
  '/:bankId/staff',
  auth,
  checkRole(['super_admin', 'bank_admin']),
  bankStaffController.getStaff
);

// Get specific staff member
router.get(
  '/:bankId/staff/:staffId',
  auth,
  checkRole(['super_admin', 'bank_admin']),
  bankStaffController.getStaffMember
);

// Update staff role/permissions
router.put(
  '/:bankId/staff/:staffId',
  auth,
  checkRole(['super_admin', 'bank_admin']),
  bankStaffController.updateStaff
);

// Deactivate staff member
router.delete(
  '/:bankId/staff/:staffId',
  auth,
  checkRole(['super_admin', 'bank_admin']),
  bankStaffController.deactivateStaff
);

module.exports = router;