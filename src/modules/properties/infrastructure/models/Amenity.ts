import { DataTypes, Model } from 'sequelize';
import sequelize from '../../../../config/database';

class AmenityModel extends Model {
  public id!: string;
  public name!: string;
  public description!: string;
  public created_by!: string;
  public updated_by!: string;
  public created_at!: Date;
  public updated_at!: Date;
}

AmenityModel.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
  },

  description: {
    type: DataTypes.TEXT,
    allowNull: true,
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
  isDeleted:{
    type: DataTypes.BOOLEAN,
    defaultValue:false
  }
}, {
  sequelize,
  tableName: 'amenities',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

export default AmenityModel;

