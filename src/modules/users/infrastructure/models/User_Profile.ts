import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../../../../config/database';

// Interface for UserProfile attributes
export interface UserProfileAttributes {
  id: string;
  userId: string;
  roleId?: string;
  firstName: string;
  lastName: string;
  email: string;
  countryCode: string;
  phoneNumber: string;
  createdBy?: string | null;
  updatedBy?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

// Interface for creation (id, createdAt, updatedAt not required)
export interface UserProfileCreationAttributes
  extends Optional<UserProfileAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

// Sequelize UserProfile model
export class UserProfile
  extends Model<UserProfileAttributes, UserProfileCreationAttributes>
  implements UserProfileAttributes
{
  public id!: string;
  public userId!: string;
  public firstName!: string;
  public lastName!: string;
  public email!: string;
  public countryCode!: string;
  public phoneNumber!: string;
  public roleId?: string;
  public createdBy?: string | null;
  public updatedBy?: string | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

UserProfile.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users', // Use table name to avoid circular dependency
        key: 'id',
      },
      onDelete: 'CASCADE', // if user is deleted, profile goes too
    },
    firstName: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    countryCode: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    phoneNumber: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    roleId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'roles',
        key: 'id',
      },
    },
    createdBy: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    updatedBy: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'user_profiles',
    modelName: 'UserProfile',
  }
);

// Associations - using lazy import to avoid circular dependency
// This function must be called after both User and UserProfile models are initialized
export function defineUserProfileAssociations() {
  const User = require('./User').default;
  UserProfile.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user',
  });
}

export default UserProfile;