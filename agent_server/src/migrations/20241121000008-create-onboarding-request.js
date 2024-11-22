module.exports = {
    up: async (queryInterface, Sequelize) => {
      await queryInterface.createTable('OnboardingRequests', {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true
        },
        personalInfo: {
          type: Sequelize.JSON,
          allowNull: false
        },
        businessInfo: {
          type: Sequelize.JSON,
          allowNull: false
        },
        shareholders: {
          type: Sequelize.JSON,
          allowNull: false
        },
        documents: {
          type: Sequelize.JSON,
          allowNull: false
        },
        statusId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'RequestStatuses',
            key: 'id'
          }
        },
        agentId: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: 'Users',
            key: 'id'
          }
        },
        bankId: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: 'Banks',
            key: 'id'
          }
        },
        agencyId: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: 'Agencies',
            key: 'id'
          }
        },
        validatedBy: {
          type: Sequelize.UUID,
          allowNull: true,
          references: {
            model: 'Users',
            key: 'id'
          }
        },
        validationDate: {
          type: Sequelize.DATE,
          allowNull: true
        },
        validationComments: {
          type: Sequelize.JSON,
          allowNull: true
        },
        lastModifiedBy: {
          type: Sequelize.UUID,
          allowNull: true,
          references: {
            model: 'Users',
            key: 'id'
          }
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
      await queryInterface.dropTable('OnboardingRequests');
    }
  };