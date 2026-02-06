import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../../../../config/database';
import User from '../../../users/infrastructure/models/User';
import PropertyModel from '../../../properties/infrastructure/models/Property';

export interface BookingAttributes {
  id: string;
  user_id: string;
  property_id: string;
  check_in_date: Date;
  check_out_date: Date;
  total_amount: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  created_at?: Date;
  updated_at?: Date;
}

export interface BookingCreationAttributes extends Optional<BookingAttributes, 'id' | 'created_at' | 'updated_at'> { }

export class Booking extends Model<BookingAttributes, BookingCreationAttributes> implements BookingAttributes {
  public id!: string;
  public user_id!: string;
  public property_id!: string;
  public check_in_date!: Date;
  public check_out_date!: Date;
  public total_amount!: number;
  public status!: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Booking.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    property_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'properties',
        key: 'id'
      }
    },
    check_in_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    check_out_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    total_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('pending', 'confirmed', 'cancelled', 'completed'),
      allowNull: false,
      defaultValue: 'pending',
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
    tableName: 'bookings',
    modelName: 'Booking',
    timestamps: false,
  }
);

// Define associations
Booking.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
Booking.belongsTo(PropertyModel, { foreignKey: 'property_id', as: 'property' });

User.hasMany(Booking, { foreignKey: 'user_id', as: 'bookings' });
PropertyModel.hasMany(Booking, { foreignKey: 'property_id', as: 'bookings' });

export default Booking;



/**
 * USER_INPUT
 * 
 * CHECK_IN
 * CHECK_OUT
 * NO_OF_ADULTS
 * NO_OF_CHILDREN
 * 
 */

/**
 * CALCULATE THE PRICE BASED ON CHECKIN,CHECKOUT,NO_OF_PEOPLE
 * EG:
 *    FETCH PRICE PER DAY FROM ROOM TABLE
 *    GET THE NO OF DAYS BETWEEN CHECKIN AND CHECKOUT
 *    MULTIPLY THE PRICE PER DAY WITH NO OF DAYS
 *    CREATE A BOOKING IN BOOKING TABLE WITH STATUS PENDING
 *    DO PAYMENT  USING RAZORPAY
 *    IF PAYMENT IS SUCCESSFUL
 *    VERIY THE PAYMENT
 *    CHANGE THE BOOKING STATUS TO CONFIRMED
 *    UPDATE THE ROOM STATUS TO BOOKED
 */