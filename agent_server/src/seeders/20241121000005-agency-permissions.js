const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface) => {
    // Get the agency_admin role
    const [roles] = await queryInterface.sequelize.query(
      `SELECT id FROM Roles WHERE name = 'agency_admin' LIMIT 1;`
    );
    const agencyAdminRoleId = roles[0]?.id;

    // Get all agency-related permissions
    const [permissions] = await queryInterface.sequelize.query(
      `SELECT id FROM Permissions WHERE name LIKE 'agency.%';`
    );

    // Create role-permission assignments for agency admin
    const rolePermissions = permissions.map(permission => ({
      roleId: agencyAdminRoleId,
      permissionId: permission.id,
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    // Add additional agency-specific permissions
    const additionalPermissions = [
      {
        id: uuidv4(),
        name: 'agency.manage_settings',
        description: 'Can manage agency settings',
        category: 'agency',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'agency.view_analytics',
        description: 'Can view agency analytics',
        category: 'agency',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    // Insert additional permissions
    await queryInterface.bulkInsert('Permissions', additionalPermissions);

    // Add new permissions to role
    const newRolePermissions = additionalPermissions.map(permission => ({
      roleId: agencyAdminRoleId,
      permissionId: permission.id,
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    await queryInterface.bulkInsert('RolePermissions', [...rolePermissions, ...newRolePermissions]);
  },

  down: async (queryInterface) => {
    // Remove agency-specific permissions
    await queryInterface.bulkDelete('Permissions', {
      name: {
        [queryInterface.sequelize.Op.in]: [
          'agency.manage_settings',
          'agency.view_analytics'
        ]
      }
    });

    // Remove role-permission assignments for agency admin
    const [roles] = await queryInterface.sequelize.query(
      `SELECT id FROM Roles WHERE name = 'agency_admin' LIMIT 1;`
    );
    
    if (roles[0]) {
      await queryInterface.bulkDelete('RolePermissions', {
        roleId: roles[0].id
      });
    }
  }
};