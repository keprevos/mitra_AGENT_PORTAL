const OnboardingRequest = require('../models/OnboardingRequest');
const RequestStatus = require('../models/RequestStatus');
const RequestStatusHistory = require('../models/RequestStatusHistory');
const User = require('../models/User');
const Bank = require('../models/Bank');
const Agency = require('../models/Agency');
const { uploadFile } = require('../utils/fileUpload');
const { validateRequest } = require('../utils/requestValidation');
const { sendNotification } = require('../utils/notifications');

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
          as: 'status',
          attributes: ['code', 'description']
        },
        {
          model: User,
          as: 'agent',
          attributes: ['firstName', 'lastName', 'email']
        },
        {
          model: Bank,
          as: 'bank',
          attributes: ['name']
        },
        {
          model: Agency,
          as: 'agency',
          attributes: ['name']
        }
      ],
      order: [['updatedAt', 'DESC']]
    });

    const formattedRequests = requests.map(request => ({
      id: request.id,
      name: request.personalInfo?.firstName + ' ' + request.personalInfo?.surname,
      email: request.personalInfo?.email,
      companyName: request.businessInfo?.companyName,
      status: request.status.description,
      submissionDate: request.createdAt.toISOString().split('T')[0],
      lastModified: request.updatedAt,
      agentName: `${request.agent.firstName} ${request.agent.lastName}`,
      agencyName: request.Agency,
      bankName: request.Bank,
      data: {
        personal: request.personalInfo,
        business: request.businessInfo,
        shareholders: request.shareholders,
        documents: request.documents
      }
    }));

    res.json(formattedRequests);
  } catch (error) {
    console.error('Error fetching requests:', error);
    res.status(500).json({ message: 'Failed to fetch requests' });
  }
};

exports.getRequest = async (req, res) => {
  try {
    const request = await OnboardingRequest.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: RequestStatus,
          as: 'status',
          attributes: ['code', 'description']
        },
        {
          model: User,
          as: 'agent',
          attributes: ['firstName', 'lastName', 'email']
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

exports.createRequest = async (req, res) => {
  try {
    const { personalInfo, businessInfo, shareholders, documents } = req.body;

    // Get initial status
    const initialStatus = await RequestStatus.findOne({
      where: { code: 'REQSTATUS00030' }
    });

    if (!initialStatus) {
      return res.status(500).json({ message: 'Initial status not found' });
    }

    const request = await OnboardingRequest.create({
      personalInfo: personalInfo || {},
      businessInfo: businessInfo || {},
      shareholders: shareholders || [],
      documents: documents || {
        proofOfResidence: [],
        identityDocument: [],
        signature: [],
        bankDetails: []
      },
      statusId: initialStatus.id,
      agentId: req.user.id,
      bankId: req.user.bankId,
      agencyId: req.user.agencyId,
      lastModifiedBy: req.user.id
    });

    res.status(201).json(request);
  } catch (error) {
    console.error('Error creating request:', error);
    res.status(500).json({ message: 'Failed to create request' });
  }
};

exports.updateRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { personalInfo, businessInfo, shareholders, documents } = req.body;

    const request = await OnboardingRequest.findOne({
      where: { id, agentId: req.user.id }
    });

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    const updates = {
      ...(personalInfo && { personalInfo }),
      ...(businessInfo && { businessInfo }),
      ...(shareholders && { shareholders }),
      ...(documents && { documents }),
      lastModifiedBy: req.user.id
    };

    await request.update(updates);
    res.json(request);
  } catch (error) {
    console.error('Error updating request:', error);
    res.status(500).json({ message: 'Failed to update request' });
  }
};

exports.uploadDocument = async (req, res) => {
  try {
    const { file } = req;
    const { type } = req.body;
    
    if (!file) {
      return res.status(400).json({ message: 'No file provided' });
    }

    const request = await OnboardingRequest.findOne({
      where: { id: req.params.id }
    });

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    // Upload file
    const uploadResult = await uploadFile(file);

    // Update request documents
    const documents = request.documents || {
      proofOfResidence: [],
      identityDocument: [],
      signature: [],
      bankDetails: []
    };

    if (!documents[type]) {
      documents[type] = [];
    }
    documents[type].push(uploadResult.url);

    await request.update({
      documents,
      lastModifiedBy: req.user.id
    });

    res.json(uploadResult);
  } catch (error) {
    console.error('Error uploading document:', error);
    res.status(500).json({ message: 'Failed to upload document' });
  }
};

exports.submitRequest = async (req, res) => {
  try {
    const request = await OnboardingRequest.findOne({
      where: { id: req.params.id, agentId: req.user.id }
    });

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    // Get submitted status
    const submittedStatus = await RequestStatus.findOne({
      where: { code: 'REQSTATUS00033' }
    });

    if (!submittedStatus) {
      return res.status(500).json({ message: 'Submitted status not found' });
    }

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

    res.json(request);
  } catch (error) {
    console.error('Error submitting request:', error);
    res.status(500).json({ message: 'Failed to submit request' });
  }
};

exports.addComment = async (req, res) => {
  try {
    const { comment } = req.body;
    const request = await OnboardingRequest.findByPk(req.params.id);

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    await RequestStatusHistory.create({
      requestId: request.id,
      statusId: request.statusId,
      userId: req.user.id,
      comment
    });

    res.json({ message: 'Comment added successfully' });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ message: 'Failed to add comment' });
  }
};

exports.updateRequestStatus = async (req, res) => {
  try {
    const { status, comment } = req.body;
    const request = await OnboardingRequest.findByPk(req.params.id);

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    const newStatus = await RequestStatus.findOne({
      where: { code: status }
    });

    if (!newStatus) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    await request.update({
      statusId: newStatus.id,
      lastModifiedBy: req.user.id
    });

    await RequestStatusHistory.create({
      requestId: request.id,
      statusId: newStatus.id,
      userId: req.user.id,
      comment
    });

    res.json(request);
  } catch (error) {
    console.error('Error updating request status:', error);
    res.status(500).json({ message: 'Failed to update request status' });
  }
};