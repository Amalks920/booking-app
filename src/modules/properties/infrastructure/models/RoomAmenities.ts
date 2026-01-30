import { Model, DataTypes } from 'sequelize';
import sequelize from '../../../../config/database';

export interface RoomAmenityAttributes {
  room_id: string;
  amenity_id: string;
}

export class RoomAmenity extends Model<RoomAmenityAttributes>
  implements RoomAmenityAttributes {
  public room_id!: string;
  public amenity_id!: string;
}

RoomAmenity.init(
  {
    room_id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },
    amenity_id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },
  },
  {
    sequelize,
    tableName: 'room_amenities',
    modelName: 'RoomAmenity',
    timestamps: false,
    underscored: true,
  }
);

export default RoomAmenity;
