export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('roles', {
    id: {
      type: Sequelize.UUID,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
    },
    name: {
      type: Sequelize.STRING(50),
      allowNull: false,
      unique: true,
    },
    description: {
      type: Sequelize.TEXT,
    },
    createdAt: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },
    updatedAt: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
    },
  });

  await queryInterface.createTable('permissions', {
    id: {
      type: Sequelize.UUID,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
    },
    name: {
      type: Sequelize.STRING(100),
      allowNull: false,
      unique: true,
    },
    description: {
      type: Sequelize.TEXT,
    },
    createdAt: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },
    updatedAt: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
    },
  });

  await queryInterface.createTable('role_permissions', {
    roleId: {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'roles',
        key: 'id',
      },
    },
    permissionId: {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'permissions',
        key: 'id',
      },
    },
    createdAt: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },
    createdBy: {
      type: Sequelize.UUID,
      allowNull: true,
    },
  });

  // Add other tables following the same pattern...
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('role_permissions');
  await queryInterface.dropTable('permissions');
  await queryInterface.dropTable('roles');
  // Drop other tables in reverse order...
}