const express = require('express');
const router = express.Router();
const { auth, checkRole } = require('../middleware/auth');
const onboardingController = require('../controllers/onboardingController');
const upload = require('../middleware/upload');

// Get all requests
router.get('/requests', 
  auth,
  onboardingController.getRequests
);

// Get request by ID
router.get('/requests/:id',
  auth,
  onboardingController.getRequest
);

// Create new request
router.post('/requests', 
  auth, 
  checkRole(['agent_staff']), 
  onboardingController.createRequest
);

// Update existing request
router.put('/requests/:id',
  auth,
  checkRole(['agent_staff']),
  onboardingController.updateRequest
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

// Add comment to request
router.post('/requests/:id/comments',
  auth,
  onboardingController.addComment
);

// Update request status
router.put('/requests/:id/status',
  auth,
  checkRole(['bank_staff', 'bank_admin']),
  onboardingController.updateRequestStatus
);

module.exports = router;