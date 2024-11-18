import { Model, DataTypes } from 'sequelize';

export default class AuditLog extends Model {
  static init(sequelize) {
    return super.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        actionType: {
          type: DataTypes.ENUM(
            'user_created',
            'user_updated',
            'user_deleted',
            'permission_changed',
            'password_reset',
            'login_attempt',
            'login_success',
            'login_failed'
          ),
          allowNull: false,
        },
        entityType: {
          type: DataTypes.ENUM('user', 'bank', 'agency', 'permission', 'role'),
          allowNull: false,
        },
        entityId: {
          type: DataTypes.UUID,
          allowNull: false,
        },
        details: {
          type: DataTypes.JSON,
        },
        ipAddress: {
          type: DataTypes.STRING(45),
        },
      },
      {
        sequelize,
        modelName: 'AuditLog',
        tableName: 'audit_logs',
        timestamps: true,
        updatedAt: false,
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
  }
}