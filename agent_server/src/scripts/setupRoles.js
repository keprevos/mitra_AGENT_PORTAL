const Role = require('../models/Role');
const User = require('../models/User');
const { v4: uuidv4 } = require('uuid');

async function setupRoles() {
  try {
    // Define roles and their permissions
    const roles = [
      {
        name: 'super_admin',
        permissions: {
          all: true
        }
      },
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
    ];

    // Create roles
    for (const role of roles) {
      await Role.create(role);
    }

    // Create super admin user
    const superAdminRole = await Role.findOne({ where: { name: 'super_admin' } });
    await User.create({
      email: 'admin@example.com',
      password: 'Admin123!',
      firstName: 'Super',
      lastName: 'Admin',
      roleId: superAdminRole.id
    });

    console.log('Roles and super admin user created successfully');
  } catch (error) {
    console.error('Error setting up roles:', error);
  }
}

setupRoles();