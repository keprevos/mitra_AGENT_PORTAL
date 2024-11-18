import { Model, DataTypes } from 'sequelize';

export default class Role extends Model {
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
        modelName: 'Role',
        tableName: 'roles',
        timestamps: true,
      }
    );
  }

  static associate(models) {
    this.belongsToMany(models.Permission, {
      through: 'role_permissions',
      foreignKey: 'roleId',
      otherKey: 'permissionId',
      as: 'permissions',
    });
    this.hasMany(models.User, { foreignKey: 'roleId', as: 'users' });
  }
}