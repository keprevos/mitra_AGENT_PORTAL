const { User } = require('../models/User');
const { Bank } = require('../models/Bank');
const { Agency } = require('../models/Agency');
const { Role } = require('../models/Role');
const { Permission } = require('../models/Permission');

/**
 * Send notifications based on request events
 * @param {string} type - The type of notification
 * @param {Object} data - Notification data
 */
exports.sendNotification = async (type, data) => {
  try {
    switch (type) {
      case 'request_submitted':
        await notifyBankStaff(data);
        break;
      case 'status_changed':
        await notifyStatusChange(data);
        break;
      case 'validation_required':
        await notifyValidators(data);
        break;
      default:
        console.warn(`Unknown notification type: ${type}`);
    }
  } catch (error) {
    console.error('Notification error:', error);
    // Don't throw - notifications shouldn't break the main flow
  }
};

async function notifyBankStaff({ requestId, bankId, agencyId }) {
  // Get bank staff with review permissions
  const bankStaff = await User.findAll({
    where: {
      bankId,
      status: 'active',
      '$Role.permissions.name$': 'bank.review_requests'
    },
    include: [{
      model: Role,
      include: [{
        model: Permission,
        as: 'permissions'
      }]
    }]
  });

  // In production, send actual notifications (email, push, etc.)
  console.log(`Notifying ${bankStaff.length} bank staff members about new request ${requestId}`);
}

async function notifyStatusChange({ requestId, status, comment }) {
  const request = await OnboardingRequest.findByPk(requestId, {
    include: [
      { model: User, as: 'agent' },
      { model: Bank },
      { model: Agency }
    ]
  });

  if (!request) return;

  // Notify relevant parties based on status
  switch (status) {
    case 'CORRECTION_REQUIRED':
      // Notify agent
      console.log(`Notifying agent ${request.agent.email} about corrections needed for request ${requestId}`);
      break;
    case 'APPROVED':
      // Notify agent and bank staff
      console.log(`Notifying all parties about approval of request ${requestId}`);
      break;
    case 'REJECTED':
      // Notify agent with rejection reason
      console.log(`Notifying agent about rejection of request ${requestId}: ${comment}`);
      break;
  }
}

async function notifyValidators({ requestId, validationType }) {
  const request = await OnboardingRequest.findByPk(requestId);
  if (!request) return;

  // Get validators based on validation type
  const validators = await User.findAll({
    where: {
      bankId: request.bankId,
      status: 'active',
      '$Role.permissions.name$': `bank.${validationType}_validation`
    },
    include: [{
      model: Role,
      include: [{
        model: Permission,
        as: 'permissions'
      }]
    }]
  });

  console.log(`Notifying ${validators.length} validators for ${validationType} validation of request ${requestId}`);
}