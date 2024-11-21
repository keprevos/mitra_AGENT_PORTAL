const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface) => {
    const permissions = [
      // System Permissions
      {
        id: uuidv4(),
        name: 'system.manage_banks',
        description: 'Can manage bank entities',
        category: 'system',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'system.manage_roles',
        description: 'Can manage roles and permissions',
        category: 'system',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'system.view_audit_logs',
        description: 'Can view system audit logs',
        category: 'system',
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // Bank Permissions
      {
        id: uuidv4(),
        name: 'bank.manage_staff',
        description: 'Can manage bank staff',
        category: 'bank',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'bank.manage_agents',
        description: 'Can manage bank agents',
        category: 'bank',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'bank.view_reports',
        description: 'Can view bank reports',
        category: 'bank',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'bank.manage_settings',
        description: 'Can manage bank settings',
        category: 'bank',
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // Agency Permissions
      {
        id: uuidv4(),
        name: 'agency.manage_staff',
        description: 'Can manage agency staff',
        category: 'agency',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'agency.manage_customers',
        description: 'Can manage agency customers',
        category: 'agency',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'agency.view_reports',
        description: 'Can view agency reports',
        category: 'agency',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'agency.process_transactions',
        description: 'Can process agency transactions',
        category: 'agency',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    await queryInterface.bulkInsert('Permissions', permissions);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('Permissions', null, {});
  }
};