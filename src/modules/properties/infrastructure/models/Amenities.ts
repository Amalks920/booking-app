import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../../../../config/database';
import RoomModel from './Room';
import RoomAmenity from './RoomAmenities';

// Interface for Amenity attributes
export interface AmenityAttributes {
  id: number;
  name: string;
  description?: string;
  created_by: number;
  updated_by: number;
  created_at: Date;
  updated_at: Date;
}

// For creating a new Amenity (id, created_at, updated_at auto-generated)
export interface AmenityCreationAttributes 
  extends Optional<AmenityAttributes, 'id' | 'created_at' | 'updated_at'> {}

// Sequelize Model
export class Amenity extends Model<AmenityAttributes, AmenityCreationAttributes>
  implements AmenityAttributes {
  public id!: number;
  public name!: string;
  public description?: string;
  public created_by!: number;
  public updated_by!: number;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

// Initialize the model
Amenity.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 100],
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
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
    tableName: 'amenities',
    modelName: 'Amenity',
    timestamps: false, // since you're explicitly using created_at & updated_at
    underscored: true, // makes sure created_at/updated_at column naming works
  }
);

Amenity.belongsToMany(RoomModel, {
    through: RoomAmenity,
    foreignKey: 'amenity_id',
    otherKey: 'room_id',
    as: 'rooms',
  });

export default Amenity;