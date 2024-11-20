module.exports = {
    up: async (queryInterface, Sequelize) => {
      await queryInterface.addColumn('Users', 'department', {
        type: Sequelize.STRING,
        allowNull: true, // Allows null for flexibility
      });
    },
  
    down: async (queryInterface) => {
      await queryInterface.removeColumn('Users', 'department');
    },
  };
  