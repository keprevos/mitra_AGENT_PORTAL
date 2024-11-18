const User = require('./User');
const Role = require('./Role');
const Bank = require('./Bank');
const Agent = require('./Agent');
const AccountRequest = require('./AccountRequest');
const PersonalDetails = require('./PersonalDetails');
const BusinessDetails = require('./BusinessDetails');

// Define associations
Role.hasMany(User, { foreignKey: 'roleId' });
User.belongsTo(Role, { foreignKey: 'roleId' });

Bank.hasMany(User, { foreignKey: 'bankId' });
User.belongsTo(Bank, { foreignKey: 'bankId' });

Agent.hasMany(User, { foreignKey: 'agentId' });
User.belongsTo(Agent, { foreignKey: 'agentId' });

AccountRequest.belongsTo(PersonalDetails, { foreignKey: 'personalDetailsId' });
AccountRequest.belongsTo(BusinessDetails, { foreignKey: 'businessDetailsId' });
AccountRequest.belongsTo(Bank, { foreignKey: 'bankId' });
AccountRequest.belongsTo(Agent, { foreignKey: 'agentId' });

module.exports = {
  User,
  Role,
  Bank,
  Agent,
  AccountRequest,
  PersonalDetails,
  BusinessDetails
};