import { requestModel } from '../models/requestModel.js';

export const requestController = {
  async createRequest(req, res) {
    try {
      const requestData = {
        ...req.body,
        agentId: req.user.id,
        status: 'pending'
      };
      
      const request = await requestModel.create(requestData);
      res.status(201).json(request);
    } catch (error) {
      console.error('Create request error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  async getBankRequests(req, res) {
    try {
      const { bankId } = req.params;
      const requests = await requestModel.getByBank(bankId);
      res.json(requests);
    } catch (error) {
      console.error('Get bank requests error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  async updateRequestStatus(req, res) {
    try {
      const { id } = req.params;
      const { status, comment } = req.body;
      
      const success = await requestModel.updateStatus(id, status, {
        userId: req.user.id,
        text: comment
      });
      
      if (!success) {
        return res.status(404).json({ message: 'Request not found' });
      }

      res.json({ message: 'Request status updated successfully' });
    } catch (error) {
      console.error('Update request status error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  async validateField(req, res) {
    try {
      const { id } = req.params;
      const validation = {
        ...req.body,
        validatedBy: req.user.id
      };
      
      const success = await requestModel.addValidation(id, validation);
      if (!success) {
        return res.status(404).json({ message: 'Request not found' });
      }

      res.json({ message: 'Field validation added successfully' });
    } catch (error) {
      console.error('Validate field error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
};