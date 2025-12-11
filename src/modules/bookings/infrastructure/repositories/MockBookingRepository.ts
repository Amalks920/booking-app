import { Booking, CreateBookingDto, UpdateBookingDto } from '../../domain/entities/Booking';
import { BookingWithRelations } from '../../domain/services/BookingService';
import { IBookingRepository } from '../../domain/repositories/IBookingRepository';

export class MockBookingRepository implements IBookingRepository {
  private bookings: Booking[] = [];
  private nextId = 1;

  constructor() {
    // Initialize with some mock data
    this.bookings = [
      {
        id: 1,
        user_id: 1,
        property_id: 1,
        check_in_date: new Date('2024-01-15'),
        check_out_date: new Date('2024-01-20'),
        total_amount: 500,
        status: 'confirmed',
        created_at: new Date('2024-01-10'),
        updated_at: new Date('2024-01-10')
      },
      {
        id: 2,
        user_id: 2,
        property_id: 1,
        check_in_date: new Date('2024-02-01'),
        check_out_date: new Date('2024-02-05'),
        total_amount: 400,
        status: 'pending',
        created_at: new Date('2024-01-25'),
        updated_at: new Date('2024-01-25')
      }
    ];
    this.nextId = 3;
  }

  async create(bookingData: CreateBookingDto): Promise<Booking> {
    const newBooking: Booking = {
      id: this.nextId++,
      ...bookingData,
      status: bookingData.status || 'pending',
      created_at: new Date(),
      updated_at: new Date()
    };
    this.bookings.push(newBooking);
    return newBooking;
  }

  async findById(id: number): Promise<Booking | null> {
    return this.bookings.find(booking => booking.id === id) || null;
  }

  async update(id: number, bookingData: UpdateBookingDto): Promise<Booking | null> {
    const index = this.bookings.findIndex(booking => booking.id === id);
    if (index === -1) return null;

    this.bookings[index] = {
      ...this.bookings[index],
      ...bookingData,
      updated_at: new Date()
    } as Booking;
    return this.bookings[index];
  }

  async delete(id: number): Promise<boolean> {
    const index = this.bookings.findIndex(booking => booking.id === id);
    if (index === -1) return false;
    
    this.bookings.splice(index, 1);
    return true;
  }

  // Mock implementations of join operations
  async getBookingWithUserAndProperty(id: number): Promise<BookingWithRelations | null> {
    const booking = await this.findById(id);
    if (!booking) return null;

    // Mock user and property data
    return {
      ...booking,
      user: {
        id: booking.user_id,
        name: `User ${booking.user_id}`,
        email: `user${booking.user_id}@example.com`,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      property: {
        id: booking.property_id,
        property_name: `Property ${booking.property_id}`,
        description: `Description for property ${booking.property_id}`,
        type: 'Hotel',
        address: `Address ${booking.property_id}`,
        city: 'Sample City',
        state: 'Sample State',
        country: 'Sample Country',
        pincode: '12345',
        latitude: 40.7128,
        longitude: -74.0060,
        contact_number: '+1234567890',
        status: 'active',
        created_by: 1,
        updated_by: 1,
        created_at: new Date(),
        updated_at: new Date()
      }
    };
  }

  async getUserBookingsWithProperties(userId: number): Promise<BookingWithRelations[]> {
    const userBookings = this.bookings.filter(booking => booking.user_id === userId);
    
    return userBookings.map(booking => ({
      ...booking,
      property: {
        id: booking.property_id,
        property_name: `Property ${booking.property_id}`,
        description: `Description for property ${booking.property_id}`,
        type: 'Hotel',
        address: `Address ${booking.property_id}`,
        city: 'Sample City',
        state: 'Sample State',
        country: 'Sample Country',
        pincode: '12345',
        latitude: 40.7128,
        longitude: -74.0060,
        contact_number: '+1234567890',
        status: 'active',
        created_by: 1,
        updated_by: 1,
        created_at: new Date(),
        updated_at: new Date()
      }
    }));
  }

  async getPropertyBookingsWithUsers(propertyId: number): Promise<BookingWithRelations[]> {
    const propertyBookings = this.bookings.filter(booking => booking.property_id === propertyId);
    
    return propertyBookings.map(booking => ({
      ...booking,
      user: {
        id: booking.user_id,
        name: `User ${booking.user_id}`,
        email: `user${booking.user_id}@example.com`,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    }));
  }

  async getAllBookingsWithRelations(): Promise<BookingWithRelations[]> {
    const results = await Promise.all(this.bookings.map(booking => this.getBookingWithUserAndProperty(booking.id)));
    return results.filter((result): result is BookingWithRelations => result !== null);
  }

  async getBookingsByDateRange(startDate: Date, endDate: Date): Promise<BookingWithRelations[]> {
    const filteredBookings = this.bookings.filter(booking => 
      booking.check_in_date >= startDate && booking.check_out_date <= endDate
    );
    
    const results = await Promise.all(filteredBookings.map(booking => this.getBookingWithUserAndProperty(booking.id)));
    return results.filter((result): result is BookingWithRelations => result !== null);
  }

  async getBookingsByStatus(status: string): Promise<BookingWithRelations[]> {
    const filteredBookings = this.bookings.filter(booking => booking.status === status);
    
    const results = await Promise.all(filteredBookings.map(booking => this.getBookingWithUserAndProperty(booking.id)));
    return results.filter((result): result is BookingWithRelations => result !== null);
  }

  async getBookingsByUserAndStatus(userId: number, status: string): Promise<BookingWithRelations[]> {
    const filteredBookings = this.bookings.filter(booking => 
      booking.user_id === userId && booking.status === status
    );
    
    const results = await Promise.all(filteredBookings.map(booking => this.getBookingWithUserAndProperty(booking.id)));
    return results.filter((result): result is BookingWithRelations => result !== null);
  }

  async getBookingStatsByProperty(): Promise<any[]> {
    // Mock statistics
    return [
      {
        property_id: 1,
        total_bookings: 2,
        total_revenue: 900,
        average_booking_value: 450,
        property: {
          id: 1,
          property_name: 'Property 1',
          city: 'Sample City',
          type: 'Hotel'
        }
      }
    ];
  }
} 