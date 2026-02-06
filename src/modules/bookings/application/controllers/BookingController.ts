import { Request, Response } from 'express';
import { IBookingService } from '../../domain/services/BookingService';
import { AuthenticatedRequest } from '../../../../types';

export class BookingController {
  constructor(private readonly bookingService: IBookingService) { }

  // Basic CRUD operations
  async createBooking(req: Request, res: Response): Promise<void> {
    try {
      const bookingData = req.body;
      const user_id = (req as AuthenticatedRequest).user?.id;

      if (!user_id) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }

      // We might need to map or validate that bookingData matches CreateBookingDto
      // For now assuming body has correct shape minus user_id and status
      const booking = await this.bookingService.createBooking({
        ...bookingData,
        user_id,
        status: 'pending' // Default status
      });

      res.status(201).json({
        success: true,
        data: booking,
        message: 'Booking created successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to create booking',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // JOIN EXAMPLES - These show how to handle joins in your project!

  // 1. Get a single booking with user and property details
  async getBookingWithDetails(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({
          success: false,
          message: 'Booking ID is required'
        });
        return;
      }

      const booking = await this.bookingService.getBookingWithUserAndProperty(id);

      if (!booking) {
        res.status(404).json({
          success: false,
          message: 'Booking not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: {
          id: booking.id,
          check_in_date: booking.check_in_date,
          check_out_date: booking.check_out_date,
          total_amount: booking.total_amount,
          status: booking.status,
          user: {
            id: booking.user?.id,
            name: booking.user?.name,
            email: booking.user?.email
          },
          property: {
            id: booking.property?.id,
            name: booking.property?.property_name,
            address: booking.property?.address,
            city: booking.property?.city,
            type: booking.property?.type
          }
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch booking details',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // 2. Get all bookings for a user with property details
  async getUserBookings(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      if (!userId) {
        res.status(400).json({
          success: false,
          message: 'User ID is required'
        });
        return;
      }

      const bookings = await this.bookingService.getUserBookingsWithProperties(userId);

      res.status(200).json({
        success: true,
        data: bookings.map(booking => ({
          id: booking.id,
          check_in_date: booking.check_in_date,
          check_out_date: booking.check_out_date,
          total_amount: booking.total_amount,
          status: booking.status,
          property: {
            id: booking.property?.id,
            name: booking.property?.property_name,
            address: booking.property?.address,
            city: booking.property?.city,
            type: booking.property?.type
          }
        })),
        count: bookings.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch user bookings',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // 3. Get all bookings for a property with user details
  async getPropertyBookings(req: Request, res: Response): Promise<void> {
    try {
      const { propertyId } = req.params;
      if (!propertyId) {
        res.status(400).json({
          success: false,
          message: 'Property ID is required'
        });
        return;
      }

      const bookings = await this.bookingService.getPropertyBookingsWithUsers(propertyId);

      res.status(200).json({
        success: true,
        data: bookings.map(booking => ({
          id: booking.id,
          check_in_date: booking.check_in_date,
          check_out_date: booking.check_out_date,
          total_amount: booking.total_amount,
          status: booking.status,
          user: {
            id: booking.user?.id,
            name: booking.user?.name,
            email: booking.user?.email
          }
        })),
        count: bookings.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch property bookings',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // 4. Get all bookings with user and property details (admin view)
  async getAllBookingsWithDetails(_: Request, res: Response): Promise<void> {
    try {
      const bookings = await this.bookingService.getAllBookingsWithRelations();

      res.status(200).json({
        success: true,
        data: bookings.map(booking => ({
          id: booking.id,
          check_in_date: booking.check_in_date,
          check_out_date: booking.check_out_date,
          total_amount: booking.total_amount,
          status: booking.status,
          user: {
            id: booking.user?.id,
            name: booking.user?.name,
            email: booking.user?.email
          },
          property: {
            id: booking.property?.id,
            name: booking.property?.property_name,
            address: booking.property?.address,
            city: booking.property?.city,
            type: booking.property?.type
          }
        })),
        count: bookings.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch all bookings',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // 5. Advanced join query - Get bookings by date range with relations
  async getBookingsByDateRange(req: Request, res: Response): Promise<void> {
    try {
      const { startDate, endDate } = req.query;

      if (!startDate || !endDate) {
        res.status(400).json({
          success: false,
          message: 'Start date and end date are required'
        });
        return;
      }

      const bookings = await this.bookingService.getBookingsByDateRange(
        new Date(startDate as string),
        new Date(endDate as string)
      );

      res.status(200).json({
        success: true,
        data: bookings,
        count: bookings.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch bookings by date range',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // 6. Get booking statistics by property (complex join with aggregations)
  async getBookingStats(_: Request, res: Response): Promise<void> {
    try {
      const stats = await this.bookingService.getBookingStatsByProperty();

      res.status(200).json({
        success: true,
        data: stats,
        count: stats.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch booking statistics',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async getBookingById(req: Request, res: Response): Promise<void> {
    // Need to implement this if it was in the class but I missed copying it or if it's new
    // It is part of IBookingService so it should be exposed
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ error: 'Booking ID is required' });
        return;
      }
      const booking = await this.bookingService.getBookingById(id);
      if (!booking) {
        res.status(404).json({ error: 'Booking not found' });
        return;
      }
      res.json(booking);
    } catch (error) {
      res.status(500).json({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}