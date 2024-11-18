const User = require('../models/User');
const Role = require('../models/Role');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function createSuperAdmin() {
  try {
    // Find super_admin role
    const superAdminRole = await Role.findOne({ where: { name: 'super_admin' } });
    if (!superAdminRole) {
      console.error('Super admin role not found. Please run migrations first.');
      return;
    }

    // Create super admin user
    const superAdmin = await User.create({
      email: process.env.SUPER_ADMIN_EMAIL || 'admin@example.com',
      password: await bcrypt.hash(process.env.SUPER_ADMIN_PASSWORD || 'Admin@123', 10),
      firstName: 'Super',
      lastName: 'Admin',
      roleId: superAdminRole.id,
      status: 'active'
    });

    console.log('Super admin created successfully:', {
      id: superAdmin.id,
      email: superAdmin.email
    });
  } catch (error) {
    console.error('Error creating super admin:', error);
  } finally {
    process.exit();
  }
}

createSuperAdmin();