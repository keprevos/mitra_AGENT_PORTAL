const sequelize = require('../config/database');
const PersonalDetails = require('../models/PersonalDetails');
const BusinessDetails = require('../models/BusinessDetails');
const AccountRequest = require('../models/AccountRequest');
const { v4: uuidv4 } = require('uuid');

async function seedDatabase() {
  try {
    // Sync database
    await sequelize.sync({ force: true });

    // Sample agent and bank IDs
    const agentId = uuidv4();
    const bankId = uuidv4();

    // Create personal details
    const personal1 = await PersonalDetails.create({
      civilite: 'Monsieur',
      nomDusage: 'Dupont',
      prenom: 'Jean',
      nomDeNaissance: 'Dupont',
      email: 'jean.dupont@example.com',
      telephoneMobile: '+33612345678',
      adressePostale: '123 Rue de Paris, 75001 Paris',
      dateDeNaissance: '1980-01-01',
      lieuDeNaissance: 'Paris',
      paysDeNaissance: 'France',
      nationalite: 'Française',
      paysDeResidenceFiscale: 'France',
      ressortissantAmericain: false
    });

    const personal2 = await PersonalDetails.create({
      civilite: 'Madame',
      nomDusage: 'Martin',
      prenom: 'Marie',
      nomDeNaissance: 'Laurent',
      email: 'marie.martin@example.com',
      telephoneMobile: '+33623456789',
      adressePostale: '456 Avenue des Champs-Élysées, 75008 Paris',
      dateDeNaissance: '1985-05-15',
      lieuDeNaissance: 'Lyon',
      paysDeNaissance: 'France',
      nationalite: 'Française',
      paysDeResidenceFiscale: 'France',
      ressortissantAmericain: false
    });

    // Create business details
    const business1 = await BusinessDetails.create({
      formeJuridique: 'SAS',
      siret: '12345678901234',
      raisonSociale: 'Tech Solutions SAS',
      codeAPE: '6202A',
      enseigne: 'TechSol',
      adresseEntreprise: '789 Rue de l\'Innovation, 75002 Paris',
      descriptionActivite: 'Development of business software solutions',
      clientsOuFournisseurs: 'France, Belgium, Switzerland',
      dernierChiffreDaffaires: '1500000'
    });

    const business2 = await BusinessDetails.create({
      formeJuridique: 'SARL',
      siret: '98765432109876',
      raisonSociale: 'Digital Marketing SARL',
      codeAPE: '7311Z',
      enseigne: 'DigiMark',
      adresseEntreprise: '321 Boulevard du Marketing, 75009 Paris',
      descriptionActivite: 'Digital marketing and consulting services',
      clientsOuFournisseurs: 'France, Spain, Germany',
      dernierChiffreDaffaires: '800000'
    });

    // Create account requests
    await AccountRequest.create({
      agentId,
      bankId,
      personalDetailsId: personal1.id,
      businessDetailsId: business1.id,
      status: 'Pending'
    });

    await AccountRequest.create({
      agentId,
      bankId,
      personalDetailsId: personal2.id,
      businessDetailsId: business2.id,
      status: 'Under Review'
    });

    console.log('Sample data has been seeded successfully!');
    console.log(`Use these IDs for testing:\nAgent ID: ${agentId}\nBank ID: ${bankId}`);

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await sequelize.close();
  }
}

seedDatabase();