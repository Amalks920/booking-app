import { Booking, CreateBookingDto, UpdateBookingDto } from '../entities/Booking';
import { BookingWithRelations } from '../services/BookingService';

export interface IBookingRepository {
  // Basic CRUD operations
  create(bookingData: CreateBookingDto): Promise<Booking>;
  findById(id: number): Promise<Booking | null>;
  update(id: number, bookingData: UpdateBookingDto): Promise<Booking | null>;
  delete(id: number): Promise<boolean>;
  
  // Join operations - abstracted from ORM implementation
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