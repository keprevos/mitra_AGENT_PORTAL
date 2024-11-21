const express = require('express');
const router = express.Router();
const { auth, checkRole } = require('../middleware/auth');
const agencyController = require('../controllers/agencyController');

// Get all agencies (Super Admin)
router.get('/agencies', 
  auth, 
  checkRole(['super_admin']), 
  agencyController.getAllAgencies
);

// Agency Management
router.post('/banks/:bankId/agencies', 
  auth, 
  checkRole(['super_admin']), 
  agencyController.createAgency
);

router.get('/banks/:bankId/agencies', 
  auth, 
  checkRole(['super_admin', 'bank_admin']), 
  agencyController.getAgencies
);

router.put('/banks/:bankId/agencies/:agencyId', 
  auth, 
  checkRole(['super_admin', 'bank_admin']), 
  agencyController.updateAgency
);

router.delete('/banks/:bankId/agencies/:agencyId', 
  auth, 
  checkRole(['super_admin', 'bank_admin']), 
  agencyController.deleteAgency
);

// Agency Staff Management
router.post('/banks/:bankId/agencies/:agencyId/staff', 
  auth, 
  checkRole(['super_admin', 'agency_admin']), 
  agencyController.createAgencyStaff
);

router.get('/banks/:bankId/agencies/:agencyId/staff', 
  auth, 
  checkRole(['super_admin', 'agency_admin']), 
  agencyController.getAgencyStaff
);

module.exports = router;