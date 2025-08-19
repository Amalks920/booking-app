import { Model, DataTypes } from 'sequelize';
import sequelize from '../../../../config/database';

export interface RoomAmenityAttributes {
  room_id: number;
  amenity_id: number;
}

export class RoomAmenity extends Model<RoomAmenityAttributes>
  implements RoomAmenityAttributes {
  public room_id!: number;
  public amenity_id!: number;
}

RoomAmenity.init(
  {
    room_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    amenity_id: {
      type: DataTypes.INTEGER,
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
