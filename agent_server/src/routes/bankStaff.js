const express = require('express');
const router = express.Router();
const { auth, checkRole } = require('../middleware/auth');
const bankStaffController = require('../controllers/bankStaffController');

// Get all staff for a bank
router.get('/banks/:bankId/staff', 
  auth, 
  checkRole(['super_admin', 'bank_admin']), 
  bankStaffController.getBankStaff
);

// Create new staff member
router.post('/banks/:bankId/staff', 
  auth, 
  checkRole(['super_admin', 'bank_admin']), 
  bankStaffController.createBankStaff
);

// Update staff member
router.put('/banks/:bankId/staff/:staffId', 
  auth, 
  checkRole(['super_admin', 'bank_admin']), 
  bankStaffController.updateBankStaff
);

// Delete/deactivate staff member
router.delete('/banks/:bankId/staff/:staffId', 
  auth, 
  checkRole(['super_admin', 'bank_admin']), 
  bankStaffController.deleteBankStaff
);

// Update staff roles
router.put('/banks/:bankId/staff/:staffId/roles', 
  auth, 
  checkRole(['super_admin', 'bank_admin']), 
  bankStaffController.updateStaffRoles
);

module.exports = router;