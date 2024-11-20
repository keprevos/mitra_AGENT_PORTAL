module.exports = {
    up: async (queryInterface, Sequelize) => {
      await queryInterface.createTable('Agents', {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true
        },
        name: {
          type: Sequelize.STRING,
          allowNull: false
        },
        code: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true
        },
        email: {
          type: Sequelize.STRING,
          allowNull: false
        },
        phone: {
          type: Sequelize.STRING,
          allowNull: false
        },
        address: {
          type: Sequelize.TEXT,
          allowNull: false
        },
        bankId: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: 'Banks',
            key: 'id'
          }
        },
        status: {
          type: Sequelize.ENUM('active', 'inactive'),
          defaultValue: 'active'
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false
        }
      });
  
      // Add indexes
    //   await queryInterface.addIndex('Agents', ['bankId']);
    //   await queryInterface.addIndex('Agents', ['code']);
    },
  
    down: async (queryInterface) => {
      await queryInterface.dropTable('Agents');
    }
  };