const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface) => {
    // Get the bank_staff role
    const [roles] = await queryInterface.sequelize.query(
      `SELECT id FROM Roles WHERE name = 'bank_staff' LIMIT 1;`
    );
    
    const bankStaffRoleId = roles[0]?.id;
    if (!bankStaffRoleId) {
      throw new Error('Bank staff role not found');
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
    const hashedPassword = await bcrypt.hash('Staff@123', 10);

    // Create bank staff user
    await queryInterface.bulkInsert('Users', [{
      id: '44444444-4444-4444-4444-444444444444', // Fixed UUID for bank staff
      email: 'bank.staff@example.com',
      password: hashedPassword,
      firstName: 'Bank',
      lastName: 'Staff',
      roleId: bankStaffRoleId,
      bankId: bankId,
      department: 'Operations',
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);

    console.log('Bank staff credentials:');
    console.log('Email: bank.staff@example.com');
    console.log('Password: Staff@123');
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('Users', {
      email: 'bank.staff@example.com'
    });
  }
};