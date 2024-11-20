const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface) => {
    // Get the first bank's ID
    const [bank] = await queryInterface.sequelize.query(
      `SELECT id FROM Banks LIMIT 1;`
    );
    const bankId = bank[0]?.id;

    if (!bankId) {
      console.log('No bank found. Please run bank seeds first.');
      return;
    }

    await queryInterface.bulkInsert('Agents', [
      {
        id: uuidv4(),
        name: 'Premier Agency',
        code: 'PA001',
        email: 'contact@premieragency.com',
        phone: '+33123456789',
        address: '123 Agency Street, Paris',
        bankId: bankId,
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'Elite Financial Services',
        code: 'EFS002',
        email: 'contact@elitefs.com',
        phone: '+33198765432',
        address: '456 Finance Avenue, Lyon',
        bankId: bankId,
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('Agents', null, {});
  }
};