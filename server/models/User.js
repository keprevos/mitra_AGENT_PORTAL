import { Model, DataTypes } from 'sequelize';

export default class User extends Model {
  static init(sequelize) {
    return super.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
          validate: {
            isEmail: true,
          },
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        firstName: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        lastName: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        status: {
          type: DataTypes.ENUM('active', 'inactive', 'pending_password_reset'),
          defaultValue: 'pending_password_reset',
        },
        lastLogin: {
          type: DataTypes.DATE,
        },
        passwordResetToken: {
          type: DataTypes.STRING,
        },
        passwordResetExpires: {
          type: DataTypes.DATE,
        },
      },
      {
        sequelize,
        modelName: 'User',
        tableName: 'users',
        timestamps: true,
        paranoid: true,
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.Role, { foreignKey: 'roleId', as: 'role' });
    this.belongsTo(models.Bank, { foreignKey: 'bankId', as: 'bank' });
    this.belongsTo(models.Agency, { foreignKey: 'agencyId', as: 'agency' });
    this.belongsTo(models.User, { foreignKey: 'createdBy', as: 'creator' });
    this.hasMany(models.AuditLog, { foreignKey: 'userId', as: 'auditLogs' });
  }
}