module.exports = {
    up: async (queryInterface, Sequelize) => {
      await queryInterface.createTable('ValidationFeedbacks', {
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
          },
          onDelete: 'CASCADE'
        },
        fieldId: {
          type: Sequelize.STRING,
          allowNull: false,
          comment: 'Format: section.fieldName (e.g., personal.firstName)'
        },
        status: {
          type: Sequelize.ENUM('ok', 'error', 'warning'),
          allowNull: false
        },
        comment: {
          type: Sequelize.TEXT,
          allowNull: true
        },
        validatedBy: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: 'Users',
            key: 'id'
          }
        },
        validatedAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.NOW
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
  
      // Add indexes for better query performance
      await queryInterface.addIndex('ValidationFeedbacks', ['requestId']);
      await queryInterface.addIndex('ValidationFeedbacks', ['validatedBy']);
      await queryInterface.addIndex('ValidationFeedbacks', ['fieldId']);
    },
  
    down: async (queryInterface) => {
      await queryInterface.dropTable('ValidationFeedbacks');
    }
  };