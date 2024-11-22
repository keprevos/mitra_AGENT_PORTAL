const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const RequestStatusHistory = sequelize.define('RequestStatusHistory', {
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
  statusId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'RequestStatuses',
      key: 'id'
    }
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  comment: {
    type: DataTypes.TEXT
  },
  metadata: {
    type: DataTypes.JSON
  }
});

module.exports = RequestStatusHistory;