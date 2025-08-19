import { Model, DataTypes } from 'sequelize';
import sequelize from '../../../../config/database';
import User from './User';

export interface RoleAttributes {
  id: number;
  role: string;
  code: string;
  created_by: number;
  updated_by: number;
  created_at: Date;
  updated_at: Date;
}

export interface RoleCreationAttributes {
  role: string;
  code: string;
  created_by: number;
  updated_by: number;
}

export class Role extends Model<RoleAttributes, RoleCreationAttributes> implements RoleAttributes {
  public id!: number;
  public role!: string;
  public code!: string;
  public created_by!: number;
  public updated_by!: number;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Role.hasMany(User, {
  foreignKey: 'role_id',
  as: 'users'
});

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
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    updated_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'roles',
    modelName: 'Role',
  }
);

export default Role; 