import { Booking, CreateBookingDto } from '../../domain/entities/Booking';
import { IBookingRepository } from '../../domain/entities/Booking';
import BookingModel from '../models/Booking';

export class BookingRepositoryImpl implements IBookingRepository {
    async findAll(): Promise<Booking[]> {
        throw new Error('Method not implemented.');
    }

    async findById(id: string): Promise<Booking | null> {
        const booking = await BookingModel.findByPk(id);
        if (!booking) return null;
        return booking;
    }

    async findByUserId(userId: string): Promise<Booking[]> {
        const bookings = await BookingModel.findAll({ where: { user_id: userId } });
        return bookings;
    }

    async findByPropertyId(propertyId: string): Promise<Booking[]> {
        const bookings = await BookingModel.findAll({ where: { property_id: propertyId } });
        return bookings;
    }

    async create(booking: CreateBookingDto): Promise<Booking> {
        const bookingResponse = await BookingModel.create(booking as any); // Type assertion needed if Model doesn't perfectly match DTO
        return bookingResponse.toJSON() as Booking;
    }

    async update(id: string, booking: Booking): Promise<Booking | null> {
        const bookingResponse = await BookingModel.findByPk(id);
        if (!bookingResponse) return null;
        return bookingResponse.update(booking);
    }

    async delete(id: string): Promise<boolean> {
        const booking = await BookingModel.findByPk(id);
        if (!booking) return false;
        await booking.destroy();
        return true;
    }
}
