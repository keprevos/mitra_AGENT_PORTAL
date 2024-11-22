const OnboardingRequest = require('../models/OnboardingRequest');
const RequestStatus = require('../models/RequestStatus');
const RequestStatusHistory = require('../models/RequestStatusHistory');
const User = require('../models/User');
const { uploadFile } = require('../utils/fileUpload');
const { validateRequest } = require('../utils/requestValidation');
const { sendNotification } = require('../utils/notifications');

// Create request
exports.createRequest = async (req, res) => {
  try {
    const { personalInfo, businessInfo, shareholders, documents } = req.body;

    // Get initial status
    const initialStatus = await RequestStatus.findOne({
      where: { 
        code: 'REQSTATUS00030',
        active: true
      }
    });

    if (!initialStatus) {
      console.error('Initial status not found in database');
      return res.status(500).json({ 
        message: 'Initial status not found',
        details: 'Please ensure request statuses are properly seeded'
      });
    }

    // Create new request
    const request = await OnboardingRequest.create({
      personalInfo: personalInfo || {},
      businessInfo: businessInfo || {},
      shareholders: shareholders || [],
      documents: documents || {},
      statusId: initialStatus.id,
      agentId: req.user.id,
      bankId: req.user.bankId,
      agencyId: req.user.agencyId,
      lastModifiedBy: req.user.id
    });

    // Create initial status history entry
    await RequestStatusHistory.create({
      requestId: request.id,
      statusId: initialStatus.id,
      userId: req.user.id,
      comment: 'Request created'
    });

    res.status(201).json(request);
  } catch (error) {
    console.error('Error creating request:', error);
    res.status(500).json({ 
      message: 'Failed to create request',
      error: error.message 
    });
  }
};

// Update request
exports.updateRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { personalInfo, businessInfo, shareholders, documents } = req.body;

    // Find request
    const request = await OnboardingRequest.findOne({
      where: {
        id,
        agentId: req.user.id
      }
    });

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    // Only allow updates if request is in draft or correction status
    const currentStatus = await RequestStatus.findByPk(request.statusId);
    const allowedStatuses = ['REQSTATUS00030', 'REQSTATUS00034', 'REQSTATUS00035'];
    
    if (!allowedStatuses.includes(currentStatus.code)) {
      return res.status(403).json({ 
        message: 'Request cannot be modified in its current status' 
      });
    }

    // Update request with provided data
    const updates = {
      ...(personalInfo && { personalInfo }),
      ...(businessInfo && { businessInfo }),
      ...(shareholders && { shareholders }),
      ...(documents && { documents }),
      lastModifiedBy: req.user.id
    };

    await request.update(updates);

    // Get updated request with status info
    const updatedRequest = await OnboardingRequest.findOne({
      where: { id },
      include: [{
        model: RequestStatus,
        attributes: ['code', 'description', 'visibility', 'clientMessage']
      }]
    });

    res.json(updatedRequest);
  } catch (error) {
    console.error('Error updating request:', error);
    res.status(500).json({ 
      message: 'Failed to update request',
      error: error.message 
    });
  }
};

// Get request by ID
exports.getRequest = async (req, res) => {
  try {
    const request = await OnboardingRequest.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: RequestStatus,
          attributes: ['code', 'description', 'visibility', 'clientMessage']
        }
      ]
    });

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    res.json(request);
  } catch (error) {
    console.error('Error fetching request:', error);
    res.status(500).json({ message: 'Failed to fetch request' });
  }
};

// Submit request for review
exports.submitRequest = async (req, res) => {
  try {
    const request = await OnboardingRequest.findOne({
      where: { 
        id: req.params.id,
        agentId: req.user.id
      }
    });

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    // Validate complete request data
    const validationResult = await validateRequest({
      personalInfo: request.personalInfo,
      businessInfo: request.businessInfo,
      shareholders: request.shareholders,
      documents: request.documents
    }, true);

    if (!validationResult.isValid) {
      return res.status(400).json({
        message: 'Request validation failed',
        errors: validationResult.errors
      });
    }

    // Get submitted status
    const submittedStatus = await RequestStatus.findOne({
      where: { code: 'REQSTATUS00033' }
    });

    // Update request status
    await request.update({
      statusId: submittedStatus.id,
      lastModifiedBy: req.user.id
    });

    // Create status history entry
    await RequestStatusHistory.create({
      requestId: request.id,
      statusId: submittedStatus.id,
      userId: req.user.id,
      comment: 'Request submitted for review'
    });

    // Send notifications
    await sendNotification('request_submitted', {
      requestId: request.id,
      bankId: request.bankId,
      agencyId: request.agencyId
    });

    res.json(request);
  } catch (error) {
    console.error('Error submitting request:', error);
    res.status(500).json({ message: 'Failed to submit request' });
  }
};

// Upload document
exports.uploadDocument = async (req, res) => {
  try {
    const { file } = req;
    const { type } = req.body;
    
    if (!file) {
      return res.status(400).json({ message: 'No file provided' });
    }

    const request = await OnboardingRequest.findByPk(req.params.id);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    // Upload file
    const uploadResult = await uploadFile(file);

    // Update request documents
    const documents = request.documents || {};
    if (!documents[type]) {
      documents[type] = [];
    }
    documents[type].push(uploadResult.url);

    await request.update({
      documents,
      lastModifiedBy: req.user.id
    });

    res.json({ url: uploadResult.url });
  } catch (error) {
    console.error('Error uploading document:', error);
    res.status(500).json({ message: 'Failed to upload document' });
  }
};

// Get request history
exports.getRequestHistory = async (req, res) => {
  try {
    const history = await RequestStatusHistory.findAll({
      where: { requestId: req.params.id },
      include: [
        {
          model: RequestStatus,
          attributes: ['code', 'description']
        },
        {
          model: User,
          attributes: ['firstName', 'lastName', 'email']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(history);
  } catch (error) {
    console.error('Error fetching history:', error);
    res.status(500).json({ message: 'Failed to fetch history' });
  }
};

// Get requests list
exports.getRequests = async (req, res) => {
  try {
    const where = {};
    
    // Filter by role
    if (req.user.role === 'agent_staff') {
      where.agentId = req.user.id;
    } else if (req.user.role === 'bank_staff' || req.user.role === 'bank_admin') {
      where.bankId = req.user.bankId;
    }

    const requests = await OnboardingRequest.findAll({
      where,
      include: [
        {
          model: RequestStatus,
          attributes: ['code', 'description', 'visibility']
        }
      ],
      order: [['updatedAt', 'DESC']]
    });

    res.json(requests);
  } catch (error) {
    console.error('Error fetching requests:', error);
    res.status(500).json({ message: 'Failed to fetch requests' });
  }
};