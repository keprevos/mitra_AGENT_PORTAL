const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface) => {
    // Get the super_admin role ID
    const [roles] = await queryInterface.sequelize.query(
      `SELECT id FROM Roles WHERE name = 'super_admin' LIMIT 1;`
    );
    
    const superAdminRoleId = roles[0]?.id;
    if (!superAdminRoleId) {
      throw new Error('Super admin role not found');
    }

    // Create hashed password
    const hashedPassword = await bcrypt.hash('Admin@123', 10);
console.log(hashedPassword);

    // Create super admin user
    await queryInterface.bulkInsert('Users', [{
      id: '00000000-0000-0000-0000-000000000000', // Fixed UUID for super admin
      email: 'admin@example.com',
      password: hashedPassword,
      firstName: 'Super',
      lastName: 'Admin',
      roleId: superAdminRoleId,
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('Users', {
      email: 'admin@example.com'
    });
  }
};