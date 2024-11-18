const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const AccountRequest = sequelize.define('AccountRequest', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  agentId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  bankId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  personalDetailsId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  businessDetailsId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('Pending', 'Under Review', 'Validated', 'Error', 'Opened'),
    defaultValue: 'Pending'
  },
  errorMessages: {
    type: DataTypes.JSON
  },
  validatedBy: DataTypes.UUID,
  openedBy: DataTypes.UUID
});

module.exports = AccountRequest;