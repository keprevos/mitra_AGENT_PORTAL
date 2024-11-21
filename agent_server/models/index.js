const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
// const config = require(__dirname + '/../config/config.json')[env];
const config = require('../config/config');

const db = {};

// Import models
const User = require('./User');
const Role = require('./Role');
const Bank = require('./Bank');
const Agency = require('./Agency');
const AccountRequest = require('./AccountRequest');
const PersonalDetails = require('./PersonalDetails');
const BusinessDetails = require('./BusinessDetails');

// Define associations
Role.hasMany(User, { foreignKey: 'roleId' });
User.belongsTo(Role, { foreignKey: 'roleId' });

Bank.hasMany(User, { foreignKey: 'bankId' });
User.belongsTo(Bank, { foreignKey: 'bankId' });

Bank.hasMany(Agency, { foreignKey: 'bankId' });
Agency.belongsTo(Bank, { foreignKey: 'bankId' });

Agency.hasMany(User, { foreignKey: 'agencyId' });
User.belongsTo(Agency, { foreignKey: 'agencyId' });

AccountRequest.belongsTo(PersonalDetails, { foreignKey: 'personalDetailsId' });
AccountRequest.belongsTo(BusinessDetails, { foreignKey: 'businessDetailsId' });
AccountRequest.belongsTo(Bank, { foreignKey: 'bankId' });
AccountRequest.belongsTo(Agency, { foreignKey: 'agencyId' });

// Export models
module.exports = {
  User,
  Role,
  Bank,
  Agency,
  AccountRequest,
  PersonalDetails,
  BusinessDetails,
  sequelize: config.use_env_variable ? new Sequelize(process.env[config.use_env_variable], config) : new Sequelize(config.database, config.username, config.password, config)
};