import express from 'express';
import { authController } from '../controllers/authController.js';
import { bankController } from '../controllers/bankController.js';
import { superAdminController } from '../controllers/superAdminController.js';
import { auth } from '../middleware/auth.js';
import { validatePassword } from '../middleware/validatePassword.js';

const router = express.Router();

// Auth routes
router.post('/auth/login', authController.login);
router.post('/auth/refresh-token', authController.refreshToken);
router.post('/auth/request-reset', authController.requestPasswordReset);
router.post('/auth/reset-password', validatePassword, authController.resetPassword);
router.post('/auth/change-password', auth(), validatePassword, authController.changePassword);

// Super Admin routes
router.post('/super-admin/banks', auth(['super_admin']), superAdminController.registerBank);
router.put('/super-admin/banks/:bankId/permissions', auth(['super_admin']), superAdminController.updateBankPermissions);
router.get('/super-admin/hierarchy', auth(['super_admin']), superAdminController.getHierarchy);
router.get('/super-admin/audit-logs', auth(['super_admin']), superAdminController.getAuditLogs);

// Bank Admin routes
router.post('/banks/agents', auth(['bank_admin']), bankController.registerAgent);
router.post('/banks/staff', auth(['bank_admin']), bankController.registerAgentStaff);
router.get('/banks/agents', auth(['bank_admin']), bankController.getAgents);
router.get('/banks/staff', auth(['bank_admin']), bankController.getAgentStaff);
router.put('/banks/users/:userId', auth(['bank_admin']), bankController.updateUser);
router.delete('/banks/users/:userId', auth(['bank_admin']), bankController.deleteUser);

export default router;