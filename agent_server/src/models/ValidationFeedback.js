const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ValidationFeedback = sequelize.define('ValidationFeedback', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  requestId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'OnboardingRequests',
      key: 'id'
    }
  },
  fieldId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('ok', 'error', 'warning'),
    allowNull: false
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  validatedBy: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  validatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  indexes: [
    {
      fields: ['requestId']
    },
    {
      fields: ['validatedBy']
    },
    {
      fields: ['fieldId']
    }
  ]
});

// Define associations
ValidationFeedback.associate = (models) => {
  ValidationFeedback.belongsTo(models.OnboardingRequest, {
    foreignKey: 'requestId',
    as: 'request'
  });
  
  ValidationFeedback.belongsTo(models.User, {
    foreignKey: 'validatedBy',
    as: 'validator'
  });
};

module.exports = ValidationFeedback;