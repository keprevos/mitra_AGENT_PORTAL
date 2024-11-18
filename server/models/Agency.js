import { Model, DataTypes } from 'sequelize';

export default class Agency extends Model {
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
        address: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        status: {
          type: DataTypes.ENUM('active', 'inactive'),
          defaultValue: 'active',
        },
      },
      {
        sequelize,
        modelName: 'Agency',
        tableName: 'agencies',
        timestamps: true,
        paranoid: true,
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.Bank, { foreignKey: 'bankId', as: 'bank' });
    this.hasMany(models.User, { foreignKey: 'agencyId', as: 'users' });
    this.belongsTo(models.User, { foreignKey: 'createdBy', as: 'creator' });
  }
}