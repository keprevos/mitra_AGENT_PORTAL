import { v4 as uuidv4 } from 'uuid';
import { userModel } from '../models/userModel.js';
import { bankModel } from '../models/bankModel.js';
import { auditService } from '../services/auditService.js';
import { emailService } from '../services/emailService.js';
import { passwordService } from '../services/passwordService.js';
import { smsService } from '../services/smsService.js';

export const superAdminController = {
  async registerBank(req, res) {
    try {
      const {
        name,
        registrationNumber,
        address,
        adminEmail,
        adminFirstName,
        adminLastName,
        adminPhone,
        canRegisterAgents,
        canRegisterStaff,
      } = req.body;

      const bankId = uuidv4();
      const temporaryPassword = passwordService.generateTemporaryPassword();
      const hashedPassword = await passwordService.hashPassword(temporaryPassword);

      // Create bank
      const bank = await bankModel.create({
        id: bankId,
        name,
        registrationNumber,
        address,
        canRegisterAgents,
        canRegisterStaff,
        createdBy: req.user.id,
      });

      // Create bank admin user
      const bankAdmin = await userModel.create({
        id: uuidv4(),
        email: adminEmail,
        password: hashedPassword,
        firstName: adminFirstName,
        lastName: adminLastName,
        role: 'bank_admin',
        bankId,
        status: 'pending_password_reset',
        createdBy: req.user.id,
      });

      // Send credentials
      await emailService.sendWelcomeEmail(bankAdmin, temporaryPassword);
      if (adminPhone) {
        await smsService.sendTemporaryPassword(adminPhone, temporaryPassword);
      }

      // Log the action
      await auditService.logAction(
        req.user.id,
        'user_created',
        'bank',
        bankId,
        {
          bankName: name,
          adminEmail,
          permissions: { canRegisterAgents, canRegisterStaff },
        },
        req.ip
      );

      res.status(201).json({
        message: 'Bank registered successfully',
        bank,
        admin: {
          id: bankAdmin.id,
          email: bankAdmin.email,
          firstName: bankAdmin.firstName,
          lastName: bankAdmin.lastName,
        },
      });
    } catch (error) {
      console.error('Bank registration error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  async updateBankPermissions(req, res) {
    try {
      const { bankId } = req.params;
      const { canRegisterAgents, canRegisterStaff } = req.body;

      const bank = await bankModel.findById(bankId);
      if (!bank) {
        return res.status(404).json({ message: 'Bank not found' });
      }

      await bankModel.updatePermissions(bankId, {
        canRegisterAgents,
        canRegisterStaff,
      });

      await auditService.logAction(
        req.user.id,
        'permission_changed',
        'bank',
        bankId,
        { canRegisterAgents, canRegisterStaff },
        req.ip
      );

      res.json({
        message: 'Bank permissions updated successfully',
        permissions: { canRegisterAgents, canRegisterStaff },
      });
    } catch (error) {
      console.error('Update bank permissions error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  async getHierarchy(req, res) {
    try {
      const hierarchy = await bankModel.getFullHierarchy();
      res.json(hierarchy);
    } catch (error) {
      console.error('Get hierarchy error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  async getAuditLogs(req, res) {
    try {
      const {
        userId,
        actionType,
        entityType,
        startDate,
        endDate,
        limit,
      } = req.query;

      const logs = await auditService.getAuditLogs({
        userId,
        actionType,
        entityType,
        startDate,
        endDate,
        limit: parseInt(limit) || 100,
      });

      res.json(logs);
    } catch (error) {
      console.error('Get audit logs error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
};