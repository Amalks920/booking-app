import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../../../../config/database';


export interface PropertyAttributes {
    id: string;
    property_name: string;
    description: string;
    type: string;           // e.g., Hotel, Apartment, etc.
    address: string;
    city: string;
    state: string;
    country: string;
    pincode: string;
    latitude: number;
    longitude: number;
    contact_number: string;
    status: 'active' | 'inactive' | 'pending';  // enum-style status
    created_by: string;
    updated_by: string;
    created_at?: Date;
    updated_at?: Date;
  }


  export interface PropertyCreationAttributes extends Optional<PropertyAttributes, 'id' | 'created_at' | 'updated_at'> {}


  export class PropertyModel extends Model<PropertyAttributes, PropertyCreationAttributes> implements PropertyAttributes {
    public id!: string;
    public property_name!: string;
    public description!: string;
    public type!: string;
    public address!: string;
    public city!: string;
    public state!: string;
    public country!: string;
    public pincode!: string;
    public latitude!: number;
    public longitude!: number;
    public contact_number!: string;
    public status!: 'active' | 'inactive' | 'pending';
    public created_by!: string;
    public updated_by!: string;
    public readonly created_at!: Date;
    public readonly updated_at!: Date;
  }
  

  PropertyModel.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      property_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      type: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      city: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      state: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      country: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      pincode: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      latitude: {
        type: DataTypes.DECIMAL(10, 7),
        allowNull: true,
      },
      longitude: {
        type: DataTypes.DECIMAL(10, 7),
        allowNull: true,
      },
      contact_number: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM('active', 'inactive','pending'),
        allowNull: false,
        defaultValue: 'pending',
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
    tableName: 'properties',
    modelName: 'Property',
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ['property_name', 'address', 'city', 'state', 'country', 'pincode'],
      },
    ],
  }
);

// Associations - using lazy import to avoid circular dependency
// This function must be called after all related models are initialized
export function definePropertyAssociations() {
  const RoomModel = require('./Room').default;

  PropertyModel.hasMany(RoomModel, {
    foreignKey: 'property_id',
    as: 'rooms',
  });
}

export default PropertyModel;