import { Model, DataTypes } from 'sequelize';

export default class Bank extends Model {
  static init(sequelize) {
    return super.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        registrationNumber: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        address: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        canRegisterAgents: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
        },
        canRegisterStaff: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
        },
        status: {
          type: DataTypes.ENUM('active', 'inactive'),
          defaultValue: 'active',
        },
      },
      {
        sequelize,
        modelName: 'Bank',
        tableName: 'banks',
        timestamps: true,
        paranoid: true,
      }
    );
  }

  static associate(models) {
    this.hasMany(models.User, { foreignKey: 'bankId', as: 'users' });
    this.hasMany(models.Agency, { foreignKey: 'bankId', as: 'agencies' });
    this.belongsTo(models.User, { foreignKey: 'createdBy', as: 'creator' });
  }
}