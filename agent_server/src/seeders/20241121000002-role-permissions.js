const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface) => {
    // First, get all roles and permissions
    const [roles] = await queryInterface.sequelize.query(
      'SELECT id, name FROM Roles;'
    );
    const [permissions] = await queryInterface.sequelize.query(
      'SELECT id, name FROM Permissions;'
    );

    // Create mappings for easier lookup
    const roleMap = roles.reduce((acc, role) => ({ ...acc, [role.name]: role.id }), {});
    const permissionMap = permissions.reduce((acc, perm) => ({ ...acc, [perm.name]: perm.id }), {});

    // Define role-permission assignments
    const rolePermissions = [
      // Super Admin - gets all permissions
      ...permissions.map(permission => ({
        roleId: roleMap['super_admin'],
        permissionId: permission.id,
        createdAt: new Date(),
        updatedAt: new Date()
      })),

      // Bank Admin permissions
      {
        roleId: roleMap['bank_admin'],
        permissionId: permissionMap['bank.manage_staff'],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roleId: roleMap['bank_admin'],
        permissionId: permissionMap['bank.manage_agents'],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roleId: roleMap['bank_admin'],
        permissionId: permissionMap['bank.view_reports'],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roleId: roleMap['bank_admin'],
        permissionId: permissionMap['bank.manage_settings'],
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // Bank Staff permissions
      {
        roleId: roleMap['bank_staff'],
        permissionId: permissionMap['bank.view_reports'],
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // Agency Admin permissions
      {
        roleId: roleMap['agency_admin'],
        permissionId: permissionMap['agency.manage_staff'],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roleId: roleMap['agency_admin'],
        permissionId: permissionMap['agency.manage_customers'],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roleId: roleMap['agency_admin'],
        permissionId: permissionMap['agency.view_reports'],
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // Agent Staff permissions
      {
        roleId: roleMap['agent_staff'],
        permissionId: permissionMap['agency.manage_customers'],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roleId: roleMap['agent_staff'],
        permissionId: permissionMap['agency.process_transactions'],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    await queryInterface.bulkInsert('RolePermissions', rolePermissions);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('RolePermissions', null, {});
  }
};