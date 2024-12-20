const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(path.resolve(__dirname, '../config/config'))[env];
const db = {};

// Import models
const User = require('./User');
const Role = require('./Role');
const Bank = require('./Bank');
const Agency = require('./Agency'); // Correct import for Agency
const ValidationFeedback = require('./ValidationFeedback'); // Correct import for ValidationFeedback

const OnboardingRequest = require('./OnboardingRequest');
const RequestStatus = require('./RequestStatus');
const RequestStatusHistory = require('./RequestStatusHistory');
const Permission = require('./Permission');
const RolePermission = require('./RolePermission');

// Define associations
Role.hasMany(User, { foreignKey: 'roleId' });
User.belongsTo(Role, { foreignKey: 'roleId' });

Bank.hasMany(User, { foreignKey: 'bankId' });
User.belongsTo(Bank, { foreignKey: 'bankId' });

Bank.hasMany(Agency, { foreignKey: 'bankId' });
Agency.belongsTo(Bank, { foreignKey: 'bankId' });

Agency.hasMany(User, { foreignKey: 'agencyId' });
User.belongsTo(Agency, { foreignKey: 'agencyId' });

OnboardingRequest.hasMany(ValidationFeedback, {
  foreignKey: 'requestId',
  as: 'validationFeedback'
});

ValidationFeedback.belongsTo(OnboardingRequest, {
  foreignKey: 'requestId',
  as: 'request'
});

ValidationFeedback.belongsTo(User, {
  foreignKey: 'validatedBy',
  as: 'validator'
});

// Onboarding associations
OnboardingRequest.belongsTo(RequestStatus, { foreignKey: 'statusId', as: 'status' });
RequestStatus.hasMany(OnboardingRequest, { foreignKey: 'statusId', as: 'requests' });

OnboardingRequest.belongsTo(User, { foreignKey: 'agentId', as: 'agent' });
OnboardingRequest.belongsTo(Bank, { foreignKey: 'bankId', as: 'bank' });
OnboardingRequest.belongsTo(Agency, { foreignKey: 'agencyId', as: 'agency' });
Agency.hasMany(OnboardingRequest, { foreignKey: 'agencyId', as: 'agencyRequests' }); // Optional reverse association

OnboardingRequest.belongsTo(User, { foreignKey: 'validatedBy', as: 'validator' });
OnboardingRequest.belongsTo(User, { foreignKey: 'lastModifiedBy', as: 'modifier' });

// Role-Permission associations
Role.belongsToMany(Permission, {
  through: RolePermission,
  foreignKey: 'roleId',
  as: 'permissions'
});

Permission.belongsToMany(Role, {
  through: RolePermission,
  foreignKey: 'permissionId',
  as: 'roles'
});

// Initialize Sequelize
const sequelize = config.use_env_variable 
  ? new Sequelize(process.env[config.use_env_variable], config) 
  : new Sequelize(config.database, config.username, config.password, config);

// Export models and sequelize instance
module.exports = {
  User,
  Role,
  Bank,
  Agency,
  ValidationFeedback, // Added ValidationFeedback to exports
  OnboardingRequest,
  RequestStatus,
  RequestStatusHistory,
  Permission,
  RolePermission,
  sequelize,
  Sequelize
};
