const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const BankStaff = sequelize.define('BankStaff', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  bankId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Banks',
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
  role: {
    type: DataTypes.STRING,
    allowNull: false
  },
  permissions: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: []
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive'),
    defaultValue: 'active'
  }
}, {
  indexes: [
    {
      unique: true,
      fields: ['bankId', 'userId']
    }
  ]
});

// Define associations
BankStaff.associate = (models) => {
  BankStaff.belongsTo(models.Bank, { foreignKey: 'bankId' });
  BankStaff.belongsTo(models.User, { foreignKey: 'userId' });
};

module.exports = BankStaff;