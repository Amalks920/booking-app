import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../../../../config/database';
import User from './User';

// Interface for UserProfile attributes
export interface UserProfileAttributes {
  id: number;
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  countryCode: string;
  phoneNumber: string;
  createdBy?: number;
  updatedBy?: number;
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
  public id!: number;
  public userId!: number;
  public firstName!: string;
  public lastName!: string;
  public email!: string;
  public countryCode!: string;
  public phoneNumber!: string;
  public createdBy?: number;
  public updatedBy?: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Initialize the model
UserProfile.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
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
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    updatedBy: {
      type: DataTypes.INTEGER,
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

// Associations
User.hasOne(UserProfile, {
  foreignKey: 'userId',
  as: 'profile',
});
UserProfile.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

export default UserProfile;