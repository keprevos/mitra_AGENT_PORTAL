import { Model, DataTypes } from 'sequelize';

export default class Permission extends Model {
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
          unique: true,
        },
        description: {
          type: DataTypes.TEXT,
        },
      },
      {
        sequelize,
        modelName: 'Permission',
        tableName: 'permissions',
        timestamps: true,
      }
    );
  }

  static associate(models) {
    this.belongsToMany(models.Role, {
      through: 'role_permissions',
      foreignKey: 'permissionId',
      otherKey: 'roleId',
      as: 'roles',
    });
  }
}