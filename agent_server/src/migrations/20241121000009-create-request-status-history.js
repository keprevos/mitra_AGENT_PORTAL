module.exports = {
    up: async (queryInterface, Sequelize) => {
      await queryInterface.createTable('RequestStatusHistories', {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true
        },
        requestId: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: 'OnboardingRequests',
            key: 'id'
          }
        },
        statusId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'RequestStatuses',
            key: 'id'
          }
        },
        userId: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: 'Users',
            key: 'id'
          }
        },
        comment: {
          type: Sequelize.TEXT
        },
        metadata: {
          type: Sequelize.JSON
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
    },
  
    down: async (queryInterface) => {
      await queryInterface.dropTable('RequestStatusHistories');
    }
  };