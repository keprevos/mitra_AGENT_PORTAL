export async function up(queryInterface, Sequelize) {
  // Insert roles
  await queryInterface.bulkInsert('roles', [
    {
      id: 'role-001',
      name: 'super_admin',
      description: 'Super administrator with full system access',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'role-002',
      name: 'bank_admin',
      description: 'Bank administrator with bank-level access',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'role-003',
      name: 'agent',
      description: 'Bank agent with agency-level access',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'role-004',
      name: 'agent_staff',
      description: 'Agent staff with limited access',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);

  // Insert permissions
  const permissions = [
    {
      id: 'perm-001',
      name: 'system.manage_banks',
      description: 'Create and manage banks',
    },
    // ... add other permissions
  ];

  await queryInterface.bulkInsert('permissions', 
    permissions.map(p => ({
      ...p,
      createdAt: new Date(),
      updatedAt: new Date(),
    }))
  );

  // Insert role permissions
  const rolePermissions = [
    { roleId: 'role-001', permissionId: 'perm-001' },
    // ... add other role permissions
  ];

  await queryInterface.bulkInsert('role_permissions',
    rolePermissions.map(rp => ({
      ...rp,
      createdAt: new Date(),
    }))
  );
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.bulkDelete('role_permissions', null, {});
  await queryInterface.bulkDelete('permissions', null, {});
  await queryInterface.bulkDelete('roles', null, {});
}