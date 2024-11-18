const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const BusinessDetails = sequelize.define('BusinessDetails', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  formeJuridique: {
    type: DataTypes.STRING,
    allowNull: false
  },
  siret: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      len: [14, 14]
    }
  },
  raisonSociale: {
    type: DataTypes.STRING,
    allowNull: false
  },
  codeAPE: {
    type: DataTypes.STRING,
    allowNull: false
  },
  enseigne: DataTypes.STRING,
  adresseEntreprise: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  descriptionActivite: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  clientsOuFournisseurs: DataTypes.TEXT,
  dernierChiffreDaffaires: DataTypes.STRING
});

module.exports = BusinessDetails;