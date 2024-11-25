const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const RequestStatus = sequelize.define('RequestStatus', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  code: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false
  },
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  orderStatus: {
    type: DataTypes.INTEGER
  },
  statusCode: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  visibility: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  clientMessage: {
    type: DataTypes.TEXT
  },
  source: {
    type: DataTypes.STRING
  },
  destination: {
    type: DataTypes.STRING
  },
  action: {
    type: DataTypes.STRING
  },
  requiresCTO: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  requiresN2: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  requiresN1: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  origin: {
    type: DataTypes.STRING
  },
  integration: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  requiresDeposit: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  eloquaNotification: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  step: {
    type: DataTypes.ENUM('signature', 'refuser', 'accepter', 'abandonner'),
    allowNull: true
  }
});

// Define associations
RequestStatus.associate = (models) => {
  RequestStatus.hasMany(models.OnboardingRequest, {
    foreignKey: 'statusId',
    as: 'requests'
  });
};

module.exports = RequestStatus;