const sequelize = require('../config/database');
const Role = require('../models/Role');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function initializeDatabase() {
  try {
    // Force sync all models
    await sequelize.sync({ force: true });

    // Create super_admin role first
    const superAdminRole = await Role.create({
      name: 'super_admin',
      permissions: { all: true }
    });

    // Create other roles
    await Role.bulkCreate([
      {
        name: 'bank_admin',
        permissions: {
          manage_bank_staff: true,
          view_bank_requests: true,
          manage_bank_settings: true
        }
      },
      {
        name: 'bank_staff',
        permissions: {
          view_bank_requests: true,
          validate_requests: true,
          flag_errors: true
        }
      },
      {
        name: 'agent_admin',
        permissions: {
          manage_agent_staff: true,
          view_agent_requests: true,
          manage_agent_settings: true
        }
      },
      {
        name: 'agent_staff',
        permissions: {
          create_requests: true,
          view_own_requests: true,
          open_accounts: true
        }
      }
    ]);

    // Create super admin user
    const hashedPassword = await bcrypt.hash(process.env.SUPER_ADMIN_PASSWORD || 'Admin@123', 10);
    await User.create({
      email: process.env.SUPER_ADMIN_EMAIL || 'admin@example.com',
      password: hashedPassword,
      firstName: 'Super',
      lastName: 'Admin',
      roleId: superAdminRole.id,
      status: 'active'
    });

    console.log('Database initialized successfully!');
    console.log('Super Admin credentials:');
    console.log('Email:', process.env.SUPER_ADMIN_EMAIL || 'admin@example.com');
    console.log('Password:', process.env.SUPER_ADMIN_PASSWORD || 'Admin@123');

  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    await sequelize.close();
  }
}

initializeDatabase();