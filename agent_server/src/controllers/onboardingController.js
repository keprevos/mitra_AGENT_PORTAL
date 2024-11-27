const OnboardingRequest = require('../models/OnboardingRequest');
const RequestStatus = require('../models/RequestStatus');
const RequestStatusHistory = require('../models/RequestStatusHistory');
const User = require('../models/User');
const Bank = require('../models/Bank');
const Agency = require('../models/Agency');
const { uploadFile } = require('../utils/fileUpload');
const { validateRequest } = require('../utils/requestValidation');
const { sendNotification } = require('../utils/notifications');
const sequelize = require('../config/database');

const ValidationFeedback = require('../models/ValidationFeedback');

exports.addValidationFeedback = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { fieldId, status, comment } = req.body;

    // Validate request exists and user has access
    const request = await OnboardingRequest.findOne({
      where: { 
        id: id,
        bankId: req.user.bankId
      }
    });

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    // Create or update validation feedback
    const [feedback, created] = await ValidationFeedback.findOrCreate({
      where: { 
        requestId,
        fieldId
      },
      defaults: {
        status,
        comment,
        validatedBy: req.user.id,
        validatedAt: new Date()
      }
    });

    if (!created) {
      await feedback.update({
        status,
        comment,
        validatedBy: req.user.id,
        validatedAt: new Date()
      });
    }

    // Get updated feedback with validator info
    const updatedFeedback = await ValidationFeedback.findOne({
      where: { id: feedback.id },
      include: [{
        model: User,
        as: 'validator',
        attributes: ['firstName', 'lastName']
      }]
    });

    res.json(updatedFeedback);
  } catch (error) {
    console.error('Error adding validation feedback:', error);
    res.status(500).json({ message: 'Failed to add validation feedback' });
  }
};

// exports.getValidationFeedback = async (req, res) => {
//   try {
//     const { requestId } = req.params;

//     // Check if the user has access to this request
//     const request = await OnboardingRequest.findOne({
//       where: { 
//         id: requestId,
//         [req.user.role === 'agent_staff' ? 'agentId' : 'bankId']: 
//           req.user.role === 'agent_staff' ? req.user.id : req.user.bankId
//       }
//     });

//     if (!request) {
//       return res.status(404).json({ message: 'Request not found' });
//     }

//     const feedback = await ValidationFeedback.findAll({
//       where: { requestId },
//       include: [{
//         model: User,
//         as: 'validator',
//         attributes: ['firstName', 'lastName']
//       }],
//       order: [['validatedAt', 'DESC']]
//     });

//     // Format the response based on user role
//     const formattedFeedback = feedback.map(item => ({
//       id: item.id,
//       fieldId: item.fieldId,
//       status: item.status,
//       comment: item.comment,
//       validatedBy: req.user.role === 'agent_staff'
//         ? 'Bank Staff'
//         : `${item.validator.firstName} ${item.validator.lastName}`,
//       validatedAt: item.validatedAt
//     }));

//     res.json(formattedFeedback);
//   } catch (error) {
//     console.error('Error fetching validation feedback:', error);
//     res.status(500).json({ message: 'Failed to fetch validation feedback' });
//   }
// };



exports.getRequests = async (req, res) => {
  try {
    const { status } = req.query;
    const where = {};
    
    // Filter by role
    if (req.user.role === 'agent_staff') {
      where.agentId = req.user.id;
    } else if (req.user.role === 'bank_staff' || req.user.role === 'bank_admin') {
      where.bankId = req.user.bankId;
    }

    // Add status filter if provided
    if (status !== undefined) {
      const requestStatus = await RequestStatus.findOne({
        where: { statusCode: parseInt(status) }
      });
      
      if (requestStatus) {
        where.statusId = requestStatus.id;
      }
    }

    const requests = await OnboardingRequest.findAll({
      where,
      include: [
        {
          model: RequestStatus,
          as: 'status',
          attributes: ['code', 'description', 'statusCode']
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
      status: request.status.statusCode, // Return the numeric status code
      statusDescription: request.status.description,
      submissionDate: request.createdAt.toISOString().split('T')[0],
      lastModified: request.updatedAt,
      agentName: `${request.agent?.firstName || 'Unknown'} ${request.agent?.lastName || ''}`,
      agencyName: request.agency?.name || null,
      bankName: request.bank?.name || null,
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
    const { personalInfo, businessInfo, shareholders, documents } = req.body.data;

    // Fetch the existing request
    const request = await OnboardingRequest.findOne({
      where: { id, agentId: req.user.id },
    });

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    // Merge existing data with incoming updates for JSON fields
    const updatedPersonalInfo = {
      ...request.personalInfo,
      ...personalInfo,
    };

    const updatedBusinessInfo = {
      ...request.businessInfo,
      ...businessInfo,
    };

    const updatedShareholders = shareholders || request.shareholders;
    const updatedDocuments = {
      ...request.documents,
      ...documents,
    };

    // Prepare updates object
    const updates = {
      personalInfo: updatedPersonalInfo,
      businessInfo: updatedBusinessInfo,
      shareholders: updatedShareholders,
      documents: updatedDocuments,
      lastModifiedBy: req.user.id,
    };

    // Log updates for debugging
    console.log('Updates:', JSON.stringify(req.body, null, 2));

    // Update the request
    await request.update(updates, {
      fields: ['personalInfo', 'businessInfo', 'shareholders', 'documents', 'lastModifiedBy'],
    });

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

// exports.addValidationFeedback = async (req, res) => {
//   try {
//     const { requestId } = req.params;
//     const { fieldId, status, comment } = req.body;

//     const request = await OnboardingRequest.findByPk(requestId);
//     if (!request) {
//       return res.status(404).json({ message: 'Request not found' });
//     }

//     const feedback = await ValidationFeedback.create({
//       requestId,
//       fieldId,
//       status,
//       comment,
//       validatedBy: req.user.id,
//       validatedAt: new Date()
//     });

//     // Send notification to agent
//     await sendNotification('validation_feedback', {
//       requestId,
//       fieldId,
//       status,
//       validatedBy: req.user.id
//     });

//     res.json(feedback);
//   } catch (error) {
//     console.error('Error adding validation feedback:', error);
//     res.status(500).json({ message: 'Failed to add validation feedback' });
//   }
// };

exports.addComment = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { id: requestId } = req.params;
    const { fieldId, status, message } = req.body;

    // Find request with proper associations
    const request = await OnboardingRequest.findOne({
      where: { id: requestId },
      include: [
        {
          model: RequestStatus,
          as: 'status'
        }
      ],
      transaction
    });

    if (!request) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Request not found' });
    }

    // Create validation feedback
    const feedback = await ValidationFeedback.create({
      requestId,
      fieldId,
      status,
      comment: message || null,
      validatedBy: req.user.id,
      validatedAt: new Date()
    }, { transaction });

    // Create history entry
    await RequestStatusHistory.create({
      requestId,
      statusId: request.statusId,
      userId: req.user.id,
      comment: message || `Field ${fieldId} marked as ${status}`,
      metadata: { fieldId, status, type: 'validation' }
    }, { transaction });

    // Fetch the created feedback with validator info
    const populatedFeedback = await ValidationFeedback.findOne({
      where: { id: feedback.id },
      include: [{
        model: User,
        as: 'validator',
        attributes: ['firstName', 'lastName']
      }],
      transaction
    });

    await transaction.commit();

    res.json(populatedFeedback);
  } catch (error) {
    await transaction.rollback();
    console.error('Error adding validation feedback:', error);
    res.status(500).json({ message: 'Failed to add validation feedback' });
  }
};

exports.getValidationFeedback = async (req, res) => {

  console.log('Request Params:', req.params);

  try {
    // const { id } = req.params.requestId;

    // if (!id) {
    //   return res.status(400).json({ message: 'Request ID is required' });
    // }

    // First verify the request exists
    const request = await OnboardingRequest.findByPk(req.params.requestId);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    // Get validation feedback with validator details
    const feedback = await ValidationFeedback.findAll({
      where: { requestId: req.params.requestId },
      include: [{
        model: User,
        as: 'validator',
        attributes: ['firstName', 'lastName', 'email']
      }],
      order: [['validatedAt', 'DESC']]
    });

    // Format the response
    const formattedFeedback = feedback.map(item => ({
      id: item.id,
      fieldId: item.fieldId,
      status: item.status,
      comment: item.comment,
      validatedBy: `${item.validator.firstName} ${item.validator.lastName}`,
      validatedAt: item.validatedAt
    }));

    res.json(formattedFeedback);
  } catch (error) {
    console.error('Error fetching validation feedback:', error);
    res.status(500).json({ message: 'Failed to fetch validation feedback' });
  }
};

exports.addValidationFeedback = async (req, res) => {
  const transaction = await sequelize.transaction();

  console.log('Request Params:', req.params);

  try {
    const { id } = req.params;
    const { feedback } = req.body;

    if (!id) {
      await transaction.rollback();
      return res.status(400).json({ message: 'Request ID is required' });
    }

    if (!Array.isArray(feedback)) {
      await transaction.rollback();
      return res.status(400).json({ message: 'Feedback must be an array' });
    }

    // Verify request exists
    const request = await OnboardingRequest.findByPk(id);
    if (!request) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Request not found' });
    }

    // Delete existing feedback for this request
    await ValidationFeedback.destroy({
      where: { requestId: id },
      transaction
    });

    // Create new feedback entries
    const validationFeedback = await Promise.all(
      feedback.map(item => 
        ValidationFeedback.create({
          requestId: id,
          fieldId: item.fieldId,
          status: item.status,
          comment: item.comment,
          validatedBy: req.user.id,
          validatedAt: new Date()
        }, { transaction })
      )
    );

    await transaction.commit();

    // Fetch the created feedback with validator details
    const createdFeedback = await ValidationFeedback.findAll({
      where: { requestId: id },
      include: [{
        model: User,
        as: 'validator',
        attributes: ['firstName', 'lastName', 'email']
      }]
    });

    res.status(201).json(createdFeedback);
  } catch (error) {
    await transaction.rollback();
    console.error('Error adding validation feedback:', error);
    res.status(500).json({ message: 'Failed to add validation feedback' });
  }
};

exports.updateRequestStatus = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { status, comment, validationFeedback } = req.body;
    const request = await OnboardingRequest.findByPk(req.params.id, { transaction });

    if (!request) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Request not found' });
    }

    const newStatus = await RequestStatus.findOne({
      where: { statusCode: status },
      transaction
    });

    if (!newStatus) {
      await transaction.rollback();
      return res.status(400).json({ message: 'Invalid status' });
    }

    // Update request status
    await request.update({
      statusId: newStatus.id,
      lastModifiedBy: req.user.id
    }, { transaction });

    // Create status history entry
    await RequestStatusHistory.create({
      requestId: request.id,
      statusId: newStatus.id,
      userId: req.user.id,
      comment,
      metadata: { type: 'status_change' }
    }, { transaction });

    // Store validation feedback if provided
    if (validationFeedback && Array.isArray(validationFeedback)) {
      await Promise.all(validationFeedback.map(feedback =>
        ValidationFeedback.create({
          requestId: request.id,
          ...feedback,
          validatedBy: req.user.id,
          validatedAt: new Date()
        }, { transaction })
      ));
    }

    await transaction.commit();

    // Fetch updated request with associations
    const updatedRequest = await OnboardingRequest.findByPk(request.id, {
      include: [
        {
          model: RequestStatus,
          as: 'status'
        },
        {
          model: ValidationFeedback,
          as: 'validationFeedback',
          include: [{
            model: User,
            as: 'validator',
            attributes: ['firstName', 'lastName']
          }]
        }
      ]
    });

    res.json(updatedRequest);
  } catch (error) {
    await transaction.rollback();
    console.error('Error updating request status:', error);
    res.status(500).json({ message: 'Failed to update request status' });
  }
};


