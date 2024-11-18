import express from 'express';
import { authController } from '../controllers/authController.js';
import { bankController } from '../controllers/bankController.js';
import { requestController } from '../controllers/requestController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Auth routes
router.post('/auth/login', authController.login);
router.post('/auth/refresh-token', authController.refreshToken);

// Bank routes
router.post('/banks', auth(['super_admin']), bankController.createBank);
router.get('/banks', auth(['super_admin']), bankController.getBanks);
router.put('/banks/:id', auth(['super_admin']), bankController.updateBank);

// Request routes
router.post('/requests', auth(['agent']), requestController.createRequest);
router.get('/banks/:bankId/requests', auth(['bank_admin']), requestController.getBankRequests);
router.put('/requests/:id/status', auth(['bank_admin']), requestController.updateRequestStatus);
router.post('/requests/:id/validate', auth(['bank_admin']), requestController.validateField);

export default router;