const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const OnboardingRequest = sequelize.define('OnboardingRequest', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  personalInfo: {
    type: DataTypes.JSON,
    allowNull: false
  },
  businessInfo: {
    type: DataTypes.JSON,
    allowNull: false
  },
  shareholders: {
    type: DataTypes.JSON,
    allowNull: false
  },
  documents: {
    type: DataTypes.JSON,
    allowNull: false
  },
  statusId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'RequestStatuses',
      key: 'id'
    }
  },
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
  lastModifiedBy: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'Users',
      key: 'id'
    }
  }
}, {
  defaultScope: {
    include: [{
      model: sequelize.models.RequestStatus,
      as: 'status'
    }]
  }
});

// Define associations
OnboardingRequest.associate = (models) => {
  OnboardingRequest.belongsTo(models.RequestStatus, { 
    foreignKey: 'statusId',
    as: 'status'
  });
  OnboardingRequest.belongsTo(models.User, { 
    foreignKey: 'agentId',
    as: 'agent'
  });
  OnboardingRequest.belongsTo(models.Bank, { 
    foreignKey: 'bankId',
    as: 'bank'
  });
  OnboardingRequest.belongsTo(models.Agency, { 
    foreignKey: 'agencyId',
    as: 'agency'
  });
  OnboardingRequest.belongsTo(models.User, { 
    foreignKey: 'validatedBy',
    as: 'validator'
  });
  OnboardingRequest.belongsTo(models.User, { 
    foreignKey: 'lastModifiedBy',
    as: 'modifier'
  });
};

module.exports = OnboardingRequest;