import { Booking, CreateBookingDto, UpdateBookingDto } from '../entities/Booking';
import { User } from '../../../users/domain/entities/User';
import { Property } from '../../../properties/domain/entities/Property';
import { IBookingRepository } from '../entities/Booking';

export interface BookingWithRelations extends Booking {
  user?: User;
  property?: Property;
}

export interface IBookingService {
  // Basic CRUD operations
  createBooking(bookingData: CreateBookingDto): Promise<Booking>;
  getBookingById(id: string): Promise<Booking | null>;
  updateBooking(id: string, bookingData: UpdateBookingDto): Promise<Booking | null>;
  deleteBooking(id: string): Promise<boolean>;

  // Join operations - these are the key examples of handling joins
  getBookingWithUserAndProperty(id: string): Promise<BookingWithRelations | null>;
  getUserBookingsWithProperties(userId: string): Promise<BookingWithRelations[]>;
  getPropertyBookingsWithUsers(propertyId: string): Promise<BookingWithRelations[]>;
  getAllBookingsWithRelations(): Promise<BookingWithRelations[]>;

  // Advanced join queries
  getBookingsByDateRange(startDate: Date, endDate: Date): Promise<BookingWithRelations[]>;
  getBookingsByStatus(status: string): Promise<BookingWithRelations[]>;
  getBookingsByUserAndStatus(userId: string, status: string): Promise<BookingWithRelations[]>;
  getBookingStatsByProperty(): Promise<any[]>;
}

export class BookingService implements IBookingService {
  constructor(private readonly bookingRepository: IBookingRepository) { }

  // Basic CRUD operations
  async createBooking(bookingData: CreateBookingDto): Promise<Booking> {
    return this.bookingRepository.create(bookingData);
  }

  async getBookingById(id: string): Promise<Booking | null> {
    return this.bookingRepository.findById(id);
  }

  async updateBooking(id: string, bookingData: UpdateBookingDto): Promise<Booking | null> {
    return this.bookingRepository.update(id, bookingData);
  }

  async deleteBooking(id: string): Promise<boolean> {
    return this.bookingRepository.delete(id);
  }

  // Join operations - delegated to repository
  async getBookingWithUserAndProperty(id: string): Promise<BookingWithRelations | null> {
    // Not implemented in repository yet
    throw new Error('Method not implemented.');
  }

  async getUserBookingsWithProperties(userId: string): Promise<BookingWithRelations[]> {
    // Not implemented in repository yet
    throw new Error('Method not implemented.');
  }

  async getPropertyBookingsWithUsers(propertyId: string): Promise<BookingWithRelations[]> {
    // Not implemented in repository yet
    throw new Error('Method not implemented.');
  }

  async getAllBookingsWithRelations(): Promise<BookingWithRelations[]> {
    return this.bookingRepository.findAll() as unknown as Promise<BookingWithRelations[]>;
  }

  // Advanced join queries
  async getBookingsByDateRange(startDate: Date, endDate: Date): Promise<BookingWithRelations[]> {
    throw new Error('Method not implemented.');
  }

  async getBookingsByStatus(status: string): Promise<BookingWithRelations[]> {
    throw new Error('Method not implemented.');
  }

  async getBookingsByUserAndStatus(userId: string, status: string): Promise<BookingWithRelations[]> {
    const bookings = await this.bookingRepository.findByUserId(userId);
    // filtering by status locally for now since repo doesn't support it directly in findByUserId
    return bookings.filter(b => b.status === status) as unknown as BookingWithRelations[];
  }

  async getBookingStatsByProperty(): Promise<any[]> {
    throw new Error('Method not implemented.');
  }
}