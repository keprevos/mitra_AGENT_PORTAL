const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const OnboardingRequest = sequelize.define('OnboardingRequest', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  // Personal Info
  personalInfo: {
    type: DataTypes.JSON,
    allowNull: false
  },
  // Business Info
  businessInfo: {
    type: DataTypes.JSON,
    allowNull: false
  },
  // Shareholders
  shareholders: {
    type: DataTypes.JSON,
    allowNull: false
  },
  // Document References
  documents: {
    type: DataTypes.JSON,
    allowNull: false
  },
  // Status
  statusId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'RequestStatuses',
      key: 'id'
    }
  },
  // Relations
  agentId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  bankId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Banks',
      key: 'id'
    }
  },
  agencyId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Agencies',
      key: 'id'
    }
  },
  // Validation
  validatedBy: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  validationDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  validationComments: {
    type: DataTypes.JSON,
    allowNull: true
  },
  // Tracking
  lastModifiedBy: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'Users',
      key: 'id'
    }
  }
});

module.exports = OnboardingRequest;