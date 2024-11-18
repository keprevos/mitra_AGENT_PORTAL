const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface) => {
    const roles = [
      {
        id: uuidv4(),
        name: 'super_admin',
        permissions: JSON.stringify({ all: true }),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'bank_admin',
        permissions: JSON.stringify({
          manage_bank_staff: true,
          view_bank_requests: true,
          manage_bank_settings: true
        }),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'bank_staff',
        permissions: JSON.stringify({
          view_bank_requests: true,
          validate_requests: true,
          flag_errors: true
        }),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'agent_admin',
        permissions: JSON.stringify({
          manage_agent_staff: true,
          view_agent_requests: true,
          manage_agent_settings: true
        }),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'agent_staff',
        permissions: JSON.stringify({
          create_requests: true,
          view_own_requests: true,
          open_accounts: true
        }),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    await queryInterface.bulkInsert('Roles', roles);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('Roles', null, {});
  }
};