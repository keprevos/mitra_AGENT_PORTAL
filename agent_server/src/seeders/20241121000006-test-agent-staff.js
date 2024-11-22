const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface) => {
    // Get the agent_staff role
    const [roles] = await queryInterface.sequelize.query(
      `SELECT id FROM Roles WHERE name = 'agent_staff' LIMIT 1;`
    );
    
    const agentStaffRoleId = roles[0]?.id;
    if (!agentStaffRoleId) {
      throw new Error('Agent staff role not found');
    }

    // Get the first bank
    const [banks] = await queryInterface.sequelize.query(
      `SELECT id FROM Banks LIMIT 1;`
    );
    const bankId = banks[0]?.id;

    // Get the first agency
    const [agencies] = await queryInterface.sequelize.query(
      `SELECT id FROM Agencies LIMIT 1;`
    );
    const agencyId = agencies[0]?.id;

    // Create hashed password
    const hashedPassword = await bcrypt.hash('AgentStaff@123', 10);

    // Create agent staff user
    await queryInterface.bulkInsert('Users', [{
      id: '22222222-2222-2222-2222-222222222222',
      email: 'agent.staff@example.com',
      password: hashedPassword,
      firstName: 'Agent',
      lastName: 'Staff',
      roleId: agentStaffRoleId,
      bankId: bankId,
      agencyId: agencyId,
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);

    console.log('Agent staff credentials:');
    console.log('Email: agent.staff@example.com');
    console.log('Password: AgentStaff@123');
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('Users', {
      email: 'agent.staff@example.com'
    });
  }
};