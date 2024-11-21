const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Role = sequelize.define('Role', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  group: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'other'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  }
});

Role.associate = (models) => {
  Role.belongsToMany(models.Permission, {
    through: models.RolePermission,
    foreignKey: 'roleId',
    as: 'permissions' // Alias for the association
  });
};

module.exports = Role;
