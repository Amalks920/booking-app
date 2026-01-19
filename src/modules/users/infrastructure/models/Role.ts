import { Model, DataTypes } from 'sequelize';
import sequelize from '../../../../config/database';

export interface RoleAttributes {
  id: number;
  role: string;
  code: string;
}

export interface RoleCreationAttributes {
  role: string;
  code: string;
}

export class Role extends Model<RoleAttributes, RoleCreationAttributes> implements RoleAttributes {
  public id!: number;
  public role!: string;
  public code!: string;
}

// Initialize the Role model
Role.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    role: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 100]
      }
    },
    code: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        len: [2, 20],
        is: /^[A-Z0-9_]+$/
      }
    },

  },
  {
    sequelize,
    tableName: 'roles',
    modelName: 'Role',
    timestamps: true,
    underscored: true,
  }
);

export default Role; 