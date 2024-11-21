const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Adjust the path to your Sequelize instance

const RolePermission = sequelize.define('RolePermission', {
  roleId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Roles',
      key: 'id'
    },
    primaryKey: true // Mark as part of composite primary key
  },
  permissionId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Permissions',
      key: 'id'
    },
    primaryKey: true // Mark as part of composite primary key
  }
}, {
  timestamps: true, // Includes createdAt and updatedAt
  tableName: 'RolePermissions'
});

module.exports = RolePermission;
