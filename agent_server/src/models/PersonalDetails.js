const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PersonalDetails = sequelize.define('PersonalDetails', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  civilite: {
    type: DataTypes.STRING,
    allowNull: false
  },
  nomDusage: {
    type: DataTypes.STRING,
    allowNull: false
  },
  prenom: {
    type: DataTypes.STRING,
    allowNull: false
  },
  nomDeNaissance: DataTypes.STRING,
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  telephoneMobile: {
    type: DataTypes.STRING,
    allowNull: false
  },
  adressePostale: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  dateDeNaissance: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  lieuDeNaissance: {
    type: DataTypes.STRING,
    allowNull: false
  },
  paysDeNaissance: {
    type: DataTypes.STRING,
    allowNull: false
  },
  nationalite: {
    type: DataTypes.STRING,
    allowNull: false
  },
  paysDeResidenceFiscale: {
    type: DataTypes.STRING,
    allowNull: false
  },
  ressortissantAmericain: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
});

module.exports = PersonalDetails;