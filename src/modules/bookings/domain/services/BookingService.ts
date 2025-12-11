import { Booking, CreateBookingDto, UpdateBookingDto } from '../entities/Booking';
import { User } from '../../../users/domain/entities/User';
import { Property } from '../../../properties/domain/entities/Property';
import { IBookingRepository } from '../repositories/IBookingRepository';

export interface BookingWithRelations extends Booking {
  user?: User;
  property?: Property;
}

export interface IBookingService {
  // Basic CRUD operations
  createBooking(bookingData: CreateBookingDto): Promise<Booking>;
  getBookingById(id: number): Promise<Booking | null>;
  updateBooking(id: number, bookingData: UpdateBookingDto): Promise<Booking | null>;
  deleteBooking(id: number): Promise<boolean>;
  
  // Join operations - these are the key examples of handling joins
  getBookingWithUserAndProperty(id: number): Promise<BookingWithRelations | null>;
  getUserBookingsWithProperties(userId: number): Promise<BookingWithRelations[]>;
  getPropertyBookingsWithUsers(propertyId: number): Promise<BookingWithRelations[]>;
  getAllBookingsWithRelations(): Promise<BookingWithRelations[]>;
  
  // Advanced join queries
  getBookingsByDateRange(startDate: Date, endDate: Date): Promise<BookingWithRelations[]>;
  getBookingsByStatus(status: string): Promise<BookingWithRelations[]>;
  getBookingsByUserAndStatus(userId: number, status: string): Promise<BookingWithRelations[]>;
  getBookingStatsByProperty(): Promise<any[]>;
}

export class BookingService implements IBookingService {
  constructor(private readonly bookingRepository: IBookingRepository) {}

  // Basic CRUD operations
  async createBooking(bookingData: CreateBookingDto): Promise<Booking> {
    return this.bookingRepository.create(bookingData);
  }

  async getBookingById(id: number): Promise<Booking | null> {
    return this.bookingRepository.findById(id);
  }

  async updateBooking(id: number, bookingData: UpdateBookingDto): Promise<Booking | null> {
    return this.bookingRepository.update(id, bookingData);
  }

  async deleteBooking(id: number): Promise<boolean> {
    return this.bookingRepository.delete(id);
  }
  
  // Join operations - delegated to repository
  async getBookingWithUserAndProperty(id: number): Promise<BookingWithRelations | null> {
    return this.bookingRepository.getBookingWithUserAndProperty(id);
  }

  async getUserBookingsWithProperties(userId: number): Promise<BookingWithRelations[]> {
    return this.bookingRepository.getUserBookingsWithProperties(userId);
  }

  async getPropertyBookingsWithUsers(propertyId: number): Promise<BookingWithRelations[]> {
    return this.bookingRepository.getPropertyBookingsWithUsers(propertyId);
  }

  async getAllBookingsWithRelations(): Promise<BookingWithRelations[]> {
    return this.bookingRepository.getAllBookingsWithRelations();
  }
  
  // Advanced join queries
  async getBookingsByDateRange(startDate: Date, endDate: Date): Promise<BookingWithRelations[]> {
    return this.bookingRepository.getBookingsByDateRange(startDate, endDate);
  }

  async getBookingsByStatus(status: string): Promise<BookingWithRelations[]> {
    return this.bookingRepository.getBookingsByStatus(status);
  }

  async getBookingsByUserAndStatus(userId: number, status: string): Promise<BookingWithRelations[]> {
    return this.bookingRepository.getBookingsByUserAndStatus(userId, status);
  }

  async getBookingStatsByProperty(): Promise<any[]> {
    return this.bookingRepository.getBookingStatsByProperty();
  }
} 