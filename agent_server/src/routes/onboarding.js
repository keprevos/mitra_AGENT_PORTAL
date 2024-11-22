const express = require('express');
const router = express.Router();
const { auth, checkRole } = require('../middleware/auth');
const onboardingController = require('../controllers/onboardingController');
const upload = require('../middleware/upload');
const validate = require('../middleware/validator');
const { onboardingSchemas } = require('../validators/onboardingSchemas');

// Create new request or update existing one
router.post('/requests',
  auth,
  checkRole(['agent_staff']),
  validate(onboardingSchemas.createRequest),
  onboardingController.createRequest
);

// Update existing request
router.put('/requests/:id',
  auth,
  checkRole(['agent_staff']),
  validate(onboardingSchemas.updateRequest),
  onboardingController.updateRequest
);

// Get request by ID
router.get('/requests/:id',
  auth,
  onboardingController.getRequest
);

// Submit request for review
router.post('/requests/:id/submit',
  auth,
  checkRole(['agent_staff']),
  onboardingController.submitRequest
);

// Upload document
router.post('/requests/:id/documents',
  auth,
  checkRole(['agent_staff']),
  upload.single('file'),
  onboardingController.uploadDocument
);

// Get request history
router.get('/requests/:id/history',
  auth,
  onboardingController.getRequestHistory
);

// Get requests list
router.get('/requests',
  auth,
  onboardingController.getRequests
);

module.exports = router;