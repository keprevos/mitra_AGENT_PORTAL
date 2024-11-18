const express = require('express');
const router = express.Router();
const { auth, checkRole } = require('../middleware/auth');
const AccountRequest = require('../models/AccountRequest');

// Validate account request
router.patch('/:bankId/accounts/:requestId/validate', auth, checkRole(['bank_staff']), async (req, res) => {
  try {
    const request = await AccountRequest.findOne({
      where: {
        id: req.params.requestId,
        bankId: req.params.bankId
      }
    });

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    await request.update({
      status: 'Validated',
      validatedBy: req.user.id
    });

    res.json({ success: true, message: 'Request validated successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Flag account request with errors
router.patch('/:bankId/accounts/:requestId/errors', auth, checkRole(['bank_staff']), async (req, res) => {
  try {
    const request = await AccountRequest.findOne({
      where: {
        id: req.params.requestId,
        bankId: req.params.bankId
      }
    });

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    await request.update({
      status: 'Error',
      errorMessages: req.body.errorMessages
    });

    res.json({ success: true, message: 'Errors flagged successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;