const express = require('express');
const router = express.Router();
const { auth, checkRole } = require('../middleware/auth');
const AccountRequest = require('../models/AccountRequest');
const PersonalDetails = require('../models/PersonalDetails');
const BusinessDetails = require('../models/BusinessDetails');



const agentController = require('../controllers/agentController');

// Agent Management
router.post('/banks/:bankId/agents', 
  auth, 
  checkRole(['super_admin']), 
  agentController.createAgent
);

router.get('/banks/:bankId/agents', 
  auth, 
  checkRole(['super_admin', 'bank_admin']), 
  agentController.getAgents
);

router.put('/banks/:bankId/agents/:agentId', 
  auth, 
  checkRole(['super_admin', 'bank_admin']), 
  agentController.updateAgent
);

router.delete('/banks/:bankId/agents/:agentId', 
  auth, 
  checkRole(['super_admin', 'bank_admin']), 
  agentController.deleteAgent
);

// Agent Staff Management
router.post('/banks/:bankId/agents/:agentId/staff', 
  auth, 
  checkRole(['super_admin', 'agent_admin']), 
  agentController.createAgentStaff
);

router.get('/banks/:bankId/agents/:agentId/staff', 
  auth, 
  checkRole(['super_admin', 'agent_admin']), 
  agentController.getAgentStaff
);





// // Initiate account opening request
// router.post('/:agentId/accounts', auth, checkRole(['agent']), async (req, res) => {
//   try {
//     const { personalDetails, businessDetails, shareholders, documents } = req.body;

//     const personal = await PersonalDetails.create(personalDetails);
//     const business = await BusinessDetails.create(businessDetails);

//     const request = await AccountRequest.create({
//       agentId: req.params.agentId,
//       bankId: req.body.bankId,
//       personalDetailsId: personal.id,
//       businessDetailsId: business.id,
//       status: 'Pending'
//     });

//     res.status(201).json({ success: true, requestId: request.id });
//   } catch (error) {
//     res.status(400).json({ success: false, message: error.message });
//   }
// });

// // Get agent's account requests
// router.get('/:agentId/accounts', auth, checkRole(['agent']), async (req, res) => {
//   try {
//     const { status, page = 1, limit = 10 } = req.query;
//     const offset = (page - 1) * limit;

//     const where = { agentId: req.params.agentId };
//     if (status) where.status = status;

//     const requests = await AccountRequest.findAndCountAll({
//       where,
//       limit,
//       offset,
//       order: [['createdAt', 'DESC']]
//     });

//     res.json({
//       requests: requests.rows,
//       total: requests.count,
//       currentPage: page,
//       totalPages: Math.ceil(requests.count / limit)
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// // Open approved account
// router.patch('/:agentId/accounts/:requestId/open', auth, checkRole(['agent']), async (req, res) => {
//   try {
//     const request = await AccountRequest.findOne({
//       where: {
//         id: req.params.requestId,
//         agentId: req.params.agentId,
//         status: 'Validated'
//       }
//     });

//     if (!request) {
//       return res.status(404).json({ message: 'Request not found or not validated' });
//     }

//     await request.update({
//       status: 'Opened',
//       openedBy: req.user.id
//     });

//     res.json({ success: true, message: 'Account opened successfully' });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

module.exports = router;