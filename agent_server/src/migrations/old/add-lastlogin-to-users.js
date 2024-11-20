module.exports = {
    up: async (queryInterface, Sequelize) => {
      await queryInterface.addColumn('Users', 'lastLogin', {
        type: Sequelize.DATE,
        allowNull: true, // Default allows null for flexibility
      });
    },
  
    down: async (queryInterface) => {
      await queryInterface.removeColumn('Users', 'lastLogin');
    },
  };
  