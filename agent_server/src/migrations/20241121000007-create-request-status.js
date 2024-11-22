module.exports = {
    up: async (queryInterface, Sequelize) => {
      await queryInterface.createTable('RequestStatuses', {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        code: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true
        },
        description: {
          type: Sequelize.STRING,
          allowNull: false
        },
        active: {
          type: Sequelize.BOOLEAN,
          defaultValue: true
        },
        orderStatus: {
          type: Sequelize.INTEGER
        },
        statusCode: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        visibility: {
          type: Sequelize.BOOLEAN,
          defaultValue: false
        },
        clientMessage: {
          type: Sequelize.TEXT
        },
        source: {
          type: Sequelize.STRING
        },
        destination: {
          type: Sequelize.STRING
        },
        action: {
          type: Sequelize.STRING
        },
        requiresCTO: {
          type: Sequelize.BOOLEAN,
          defaultValue: false
        },
        requiresN2: {
          type: Sequelize.BOOLEAN,
          defaultValue: false
        },
        requiresN1: {
          type: Sequelize.BOOLEAN,
          defaultValue: false
        },
        origin: {
          type: Sequelize.STRING
        },
        integration: {
          type: Sequelize.BOOLEAN,
          defaultValue: false
        },
        requiresDeposit: {
          type: Sequelize.BOOLEAN,
          defaultValue: false
        },
        eloquaNotification: {
          type: Sequelize.BOOLEAN,
          defaultValue: false
        },
        step: {
          type: Sequelize.ENUM('signature', 'refuser', 'accepter', 'abandonner'),
          allowNull: true
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
      await queryInterface.dropTable('RequestStatuses');
    }
  };