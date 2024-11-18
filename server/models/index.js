import { Sequelize } from 'sequelize';
import config from '../config/database.js';

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
    logging: dbConfig.logging,
    pool: dbConfig.pool,
  }
);

const db = {
  sequelize,
  Sequelize,
};

// Import models
import User from './User.js';
import Role from './Role.js';
import Permission from './Permission.js';
import Bank from './Bank.js';
import Agency from './Agency.js';
import AuditLog from './AuditLog.js';

// Initialize models
db.User = User.init(sequelize);
db.Role = Role.init(sequelize);
db.Permission = Permission.init(sequelize);
db.Bank = Bank.init(sequelize);
db.Agency = Agency.init(sequelize);
db.AuditLog = AuditLog.init(sequelize);

// Run model associations
Object.values(db).forEach((model) => {
  if (model.associate) {
    model.associate(db);
  }
});

export default db;