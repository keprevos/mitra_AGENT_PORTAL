const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface) => {
    // Get the agency_admin role ID
    const [roles] = await queryInterface.sequelize.query(
      `SELECT id FROM Roles WHERE name = 'agency_admin' LIMIT 1;`
    );
    
    const agencyAdminRoleId = roles[0]?.id;
    if (!agencyAdminRoleId) {
      throw new Error('Agency admin role not found');
    }

    // Get the first bank ID
    const [banks] = await queryInterface.sequelize.query(
      `SELECT id FROM Banks LIMIT 1;`
    );
    const bankId = banks[0]?.id;
    if (!bankId) {
      throw new Error('No bank found');
    }

    // Get the first agency ID
    const [agencies] = await queryInterface.sequelize.query(
      `SELECT id FROM Agencies LIMIT 1;`
    );
    const agencyId = agencies[0]?.id;
    if (!agencyId) {
      throw new Error('No agency found');
    }

    // Create hashed password
    const hashedPassword = await bcrypt.hash('Agency@123', 10);

    // Create agency admin user
    await queryInterface.bulkInsert('Users', [{
      id: '11111111-1111-1111-1111-111111111111', // Fixed UUID for agency admin
      email: 'agency@example.com',
      password: hashedPassword,
      firstName: 'Agency',
      lastName: 'Admin',
      roleId: agencyAdminRoleId,
      bankId: bankId,
      agencyId: agencyId,
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);

    console.log('Agency admin credentials:');
    console.log('Email: agency@example.com');
    console.log('Password: Agency@123');
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('Users', {
      email: 'agency@example.com'
    });
  }
};