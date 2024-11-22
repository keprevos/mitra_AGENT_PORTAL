const { RequestStatus } = require('../models/RequestStatus');

module.exports = {
  up: async (queryInterface) => {
    const statuses = [
      {
        code: 'REQSTATUS00030',
        description: 'Demande enregistrée',
        active: true,
        orderStatus: 0,
        statusCode: 0,
        visibility: true,
        clientMessage: 'Votre demande a été initiée.',
        origin: 'BO - demandes non finalisées',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        code: 'REQSTATUS00031',
        description: 'Saisie complétée',
        active: true,
        orderStatus: 50,
        statusCode: 50,
        visibility: true,
        clientMessage: 'Votre demande est complète.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        code: 'REQSTATUS00032',
        description: 'Signature de la demande',
        active: true,
        orderStatus: 90,
        statusCode: 90,
        visibility: true,
        step: 'signature',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        code: 'REQSTATUS00033',
        description: 'Nouvelle demande',
        active: true,
        orderStatus: 100,
        statusCode: 100,
        visibility: true,
        clientMessage: 'Votre demande est en cours d\'examen.',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    await queryInterface.bulkInsert('RequestStatuses', statuses);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('RequestStatuses', null, {});
  }
};