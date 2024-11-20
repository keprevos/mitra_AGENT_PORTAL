module.exports = {
    up: async (queryInterface, Sequelize) => {
      // Remove agentId column
      await queryInterface.removeColumn('Users', 'agentId');
  
      // Add agencyId column
      await queryInterface.addColumn('Users', 'agencyId', {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'Agencies', // Ensure this table exists
          key: 'id'
        }
      });
    },
  
    down: async (queryInterface, Sequelize) => {
      // Add agentId column back in case of rollback
      await queryInterface.addColumn('Users', 'agentId', {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'Agents', // Ensure this table exists
          key: 'id'
        }
      });
  
      // Remove agencyId column
      await queryInterface.removeColumn('Users', 'agencyId');
    }
  };
  