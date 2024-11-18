import { bankModel } from '../models/bankModel.js';
import { userModel } from '../models/userModel.js';

export const bankController = {
  async createBank(req, res) {
    try {
      const bankData = req.body;
      const bank = await bankModel.create(bankData);
      
      // Create bank admin user if provided
      if (bankData.adminEmail) {
        await userModel.create({
          email: bankData.adminEmail,
          password: bankData.adminPassword,
          firstName: bankData.adminFirstName,
          lastName: bankData.adminLastName,
          role: 'bank_admin',
          bankId: bank.id
        });
      }

      res.status(201).json(bank);
    } catch (error) {
      console.error('Create bank error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  async getBanks(req, res) {
    try {
      const banks = await bankModel.getAll();
      res.json(banks);
    } catch (error) {
      console.error('Get banks error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  async updateBank(req, res) {
    try {
      const { id } = req.params;
      const bankData = req.body;
      
      const success = await bankModel.update(id, bankData);
      if (!success) {
        return res.status(404).json({ message: 'Bank not found' });
      }

      res.json({ message: 'Bank updated successfully' });
    } catch (error) {
      console.error('Update bank error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
};