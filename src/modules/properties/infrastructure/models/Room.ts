import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../../../../config/database';

export interface RoomAttributes {
  id: string;
  property_id: string;
  name: string;
  type: string;
  description?: string;
  capacity: number;
  beds: string;
  price_per_night: number;
  currency: string;
  status: 'available' | 'booked' | 'maintenance';
  floor_number?: number;
  size_sq_m?: number;
  view_type?: string;
  is_smoking_allowed: boolean;
  has_private_bathroom: boolean;
  created_by: string;
  updated_by: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface RoomCreationAttributes
  extends Optional<
    RoomAttributes,
    | 'id'
    | 'description'
    | 'floor_number'
    | 'size_sq_m'
    | 'view_type'
    | 'created_at'
    | 'updated_at'
  > {}

export class RoomModel
  extends Model<RoomAttributes, RoomCreationAttributes>
  implements RoomAttributes
{
  public id!: string;
  public property_id!: string;
  public name!: string;
  public type!: string;
  public description?: string;
  public capacity!: number;
  public beds!: string;
  public price_per_night!: number;
  public currency!: string;
  public status!: 'available' | 'booked' | 'maintenance';
  public floor_number?: number;
  public size_sq_m?: number;
  public view_type?: string;
  public is_smoking_allowed!: boolean;
  public has_private_bathroom!: boolean;
  public created_by!: string;
  public updated_by!: string;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

RoomModel.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    property_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'properties', // Use table name to avoid cross-module coupling
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    beds: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    price_per_night: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    currency: {
      type: DataTypes.STRING(3),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('available', 'booked', 'maintenance'),
      allowNull: false,
      defaultValue: 'available',
    },
    floor_number: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    size_sq_m: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
    },
    view_type: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    is_smoking_allowed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    has_private_bathroom: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    created_by: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    updated_by: {
      type: DataTypes.UUID,
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
    tableName: 'rooms',
    modelName: 'Room',
    timestamps: false,
  }
);

// Associations - using lazy import to avoid circular dependency
// This function must be called after all related models are initialized
export function defineRoomAssociations() {
  const PropertyModel = require('./Property').default;
  const Amenity = require('./Amenities').default;
  const RoomAmenity = require('./RoomAmenities').default;

  RoomModel.belongsToMany(Amenity, {
    through: RoomAmenity,
    foreignKey: 'room_id',
    otherKey: 'amenity_id',
    as: 'amenities',
  });

  RoomModel.belongsTo(PropertyModel, {
    foreignKey: 'property_id',
    as: 'property',
  });
}

export default RoomModel;
