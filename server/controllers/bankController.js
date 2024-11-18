import { v4 as uuidv4 } from 'uuid';
import db from '../models/index.js';
import { auditService } from '../services/auditService.js';
import { emailService } from '../services/emailService.js';
import { passwordService } from '../services/passwordService.js';
import { smsService } from '../services/smsService.js';

const { User, Bank, Agency } = db;

export const bankController = {
  async registerAgent(req, res) {
    try {
      const {
        email,
        firstName,
        lastName,
        phone,
        agencyId,
      } = req.body;

      // Check if bank has permission to register agents
      const bank = await Bank.findByPk(req.user.bankId);
      if (!bank.canRegisterAgents) {
        return res.status(403).json({
          message: 'Bank does not have permission to register agents'
        });
      }

      // Verify agency belongs to bank
      const agency = await Agency.findByPk(agencyId);
      if (!agency || agency.bankId !== req.user.bankId) {
        return res.status(400).json({
          message: 'Invalid agency selected'
        });
      }

      const temporaryPassword = passwordService.generateTemporaryPassword();
      const hashedPassword = await passwordService.hashPassword(temporaryPassword);

      const agent = await User.create({
        id: uuidv4(),
        email,
        password: hashedPassword,
        firstName,
        lastName,
        roleId: 'role-003', // agent role
        bankId: req.user.bankId,
        agencyId,
        status: 'pending_password_reset',
        createdBy: req.user.id,
      });

      // Send credentials
      await emailService.sendWelcomeEmail(agent, temporaryPassword);
      if (phone) {
        await smsService.sendTemporaryPassword(phone, temporaryPassword);
      }

      await auditService.logAction(
        req.user.id,
        'user_created',
        'user',
        agent.id,
        {
          role: 'agent',
          bankId: req.user.bankId,
          agencyId,
        },
        req.ip
      );

      res.status(201).json({
        message: 'Agent registered successfully',
        agent: {
          id: agent.id,
          email: agent.email,
          firstName: agent.firstName,
          lastName: agent.lastName,
          agencyId: agent.agencyId,
        },
      });
    } catch (error) {
      console.error('Agent registration error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  // ... rest of the controller methods remain the same but using Sequelize models
};