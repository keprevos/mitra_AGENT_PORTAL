const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface) => {
    // Get the bank_admin role
    const [roles] = await queryInterface.sequelize.query(
      `SELECT id FROM Roles WHERE name = 'bank_admin' LIMIT 1;`
    );
    
    const bankAdminRoleId = roles[0]?.id;
    if (!bankAdminRoleId) {
      throw new Error('Bank admin role not found');
    }

    // Get the first bank
    const [banks] = await queryInterface.sequelize.query(
      `SELECT id FROM Banks LIMIT 1;`
    );
    const bankId = banks[0]?.id;
    if (!bankId) {
      throw new Error('No bank found');
    }

    // Create hashed password
    const hashedPassword = await bcrypt.hash('Bank@123', 10);

    // Create bank admin user
    await queryInterface.bulkInsert('Users', [{
      id: '33333333-3333-3333-3333-333333333333', // Fixed UUID for bank admin
      email: 'bank.admin@example.com',
      password: hashedPassword,
      firstName: 'Bank',
      lastName: 'Admin',
      roleId: bankAdminRoleId,
      bankId: bankId,
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);

    console.log('Bank admin credentials:');
    console.log('Email: bank.admin@example.com');
    console.log('Password: Bank@123');
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('Users', {
      email: 'bank.admin@example.com'
    });
  }
};