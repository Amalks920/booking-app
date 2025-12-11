import { Op, fn, col, literal } from 'sequelize';
import { Booking, CreateBookingDto, UpdateBookingDto } from '../../domain/entities/Booking';
import { BookingWithRelations } from '../../domain/services/BookingService';
import { IBookingRepository } from '../../domain/repositories/IBookingRepository';
import BookingModel from '../models/Booking';
import User from '../../../users/infrastructure/models/User';
import PropertyModel from '../../../properties/infrastructure/models/Property';

export class SequelizeBookingRepository implements IBookingRepository {
  
  // Basic CRUD operations
  async create(bookingData: CreateBookingDto): Promise<Booking> {
    // Ensure status has a default value if not provided
    const dataWithStatus = {
      ...bookingData,
      status: bookingData.status || 'pending'
    };
    const booking = await BookingModel.create(dataWithStatus);
    return booking.toJSON() as Booking;
  }

  async findById(id: number): Promise<Booking | null> {
    const booking = await BookingModel.findByPk(id);
    return booking ? booking.toJSON() as Booking : null;
  }

  async update(id: number, bookingData: UpdateBookingDto): Promise<Booking | null> {
    const [updatedRows] = await BookingModel.update(bookingData, {
      where: { id }
    });
    
    if (updatedRows > 0) {
      return this.findById(id);
    }
    return null;
  }

  async delete(id: number): Promise<boolean> {
    const deletedRows = await BookingModel.destroy({
      where: { id }
    });
    return deletedRows > 0;
  }

  // JOIN OPERATIONS - These are the key examples you asked about!

  // 1. Get a single booking with user and property details
  async getBookingWithUserAndProperty(id: number): Promise<BookingWithRelations | null> {
    const booking = await BookingModel.findByPk(id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email'] // Only select needed fields
        },
        {
          model: PropertyModel,
          as: 'property',
          attributes: ['id', 'property_name', 'address', 'city', 'type']
        }
      ]
    });

    return booking ? booking.toJSON() as BookingWithRelations : null;
  }

  // 2. Get all bookings for a user with property details
  async getUserBookingsWithProperties(userId: number): Promise<BookingWithRelations[]> {
    const bookings = await BookingModel.findAll({
      where: { user_id: userId },
      include: [
        {
          model: PropertyModel,
          as: 'property',
          attributes: ['id', 'property_name', 'address', 'city', 'type', 'status']
        }
      ],
      order: [['created_at', 'DESC']] // Most recent first
    });

    return bookings.map(booking => booking.toJSON() as BookingWithRelations);
  }

  // 3. Get all bookings for a property with user details
  async getPropertyBookingsWithUsers(propertyId: number): Promise<BookingWithRelations[]> {
    const bookings = await BookingModel.findAll({
      where: { property_id: propertyId },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email']
        }
      ],
      order: [['check_in_date', 'ASC']] // Chronological order
    });

    return bookings.map(booking => booking.toJSON() as BookingWithRelations);
  }

  // 4. Get all bookings with user and property details
  async getAllBookingsWithRelations(): Promise<BookingWithRelations[]> {
    const bookings = await BookingModel.findAll({
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email']
        },
        {
          model: PropertyModel,
          as: 'property',
          attributes: ['id', 'property_name', 'address', 'city', 'type']
        }
      ],
      order: [['created_at', 'DESC']]
    });

    return bookings.map(booking => booking.toJSON() as BookingWithRelations);
  }

  // Advanced join queries with filtering

  // 5. Get bookings within a date range with relations
  async getBookingsByDateRange(startDate: Date, endDate: Date): Promise<BookingWithRelations[]> {
    const bookings = await BookingModel.findAll({
      where: {
        check_in_date: {
          [Op.gte]: startDate
        },
        check_out_date: {
          [Op.lte]: endDate
        }
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email']
        },
        {
          model: PropertyModel,
          as: 'property',
          attributes: ['id', 'property_name', 'address', 'city']
        }
      ],
      order: [['check_in_date', 'ASC']]
    });

    return bookings.map(booking => booking.toJSON() as BookingWithRelations);
  }

  // 6. Get bookings by status with relations
  async getBookingsByStatus(status: string): Promise<BookingWithRelations[]> {
    const bookings = await BookingModel.findAll({
      where: { status },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email']
        },
        {
          model: PropertyModel,
          as: 'property',
          attributes: ['id', 'property_name', 'address', 'city']
        }
      ],
      order: [['created_at', 'DESC']]
    });

    return bookings.map(booking => booking.toJSON() as BookingWithRelations);
  }

  // 7. Get bookings by user and status with relations
  async getBookingsByUserAndStatus(userId: number, status: string): Promise<BookingWithRelations[]> {
    const bookings = await BookingModel.findAll({
      where: { 
        user_id: userId,
        status 
      },
      include: [
        {
          model: PropertyModel,
          as: 'property',
          attributes: ['id', 'property_name', 'address', 'city', 'type']
        }
      ],
      order: [['created_at', 'DESC']]
    });

    return bookings.map(booking => booking.toJSON() as BookingWithRelations);
  }

  // 8. Complex join with multiple conditions and aggregations
  async getBookingStatsByProperty(): Promise<any[]> {
    const stats = await BookingModel.findAll({
      attributes: [
        'property_id',
        [fn('COUNT', col('id')), 'total_bookings'],
        [fn('SUM', col('total_amount')), 'total_revenue'],
        [fn('AVG', col('total_amount')), 'average_booking_value']
      ],
      include: [
        {
          model: PropertyModel,
          as: 'property',
          attributes: ['id', 'property_name', 'city', 'type']
        }
      ],
      group: ['property_id', 'property.id', 'property.property_name', 'property.city', 'property.type'],
      having: literal('COUNT(id) > 0'),
      order: [[fn('COUNT', col('id')), 'DESC']]
    });

    return stats.map(stat => stat.toJSON());
  }
} 