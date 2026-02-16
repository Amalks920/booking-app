import { Booking, CreateBookingDto } from '../../domain/entities/Booking';
import { IBookingRepository } from '../../domain/entities/Booking';
import BookingModel from '../models/Booking';
import RoomModel from '../../../properties/infrastructure/models/Room';
import { Op } from 'sequelize';

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


    async findAvailableRoom(check_in_date: string, check_out_date: string, guests: { adults: number, children: { age: number }[] }): Promise<RoomModel[]> {
        const checkIn = new Date(check_in_date);
        const checkOut = new Date(check_out_date);

        // Group children by age
        const childrenUnder3 = guests.children.filter(c => c.age < 3).length;
        const children3To12 = guests.children.filter(c => c.age >= 3 && c.age <= 12).length;
        const children13To17 = guests.children.filter(c => c.age >= 13 && c.age < 18).length;
        const totalGuests = guests.adults + guests.children.length;

        // Find bookings that overlap with the requested dates
        const conflictingBookings = await BookingModel.findAll({
            where: {
                status: { [Op.in]: ['confirmed', 'pending'] },
                [Op.or]: [
                    {
                        check_in_date: {
                            [Op.between]: [checkIn, checkOut]
                        }
                    },
                    {
                        check_out_date: {
                            [Op.between]: [checkIn, checkOut]
                        }
                    },
                    {
                        check_in_date: {
                            [Op.lte]: checkIn
                        },
                        check_out_date: {
                            [Op.gte]: checkOut
                        }
                    }
                ]
            },
            attributes: ['room_id']
        });

        const bookedRoomIds = conflictingBookings.map(b => b.room_id);

        // Find available rooms
        const availableRooms = await RoomModel.findAll({
            where: {
                status: 'available',
                id: { [Op.notIn]: bookedRoomIds },
                max_adult_count: { [Op.gte]: guests.adults },
                max_children_under_3_count: { [Op.gte]: childrenUnder3 },
                max_children_3_to_12_count: { [Op.gte]: children3To12 },
                max_children_13_to_17_count: { [Op.gte]: children13To17 },
                capacity: { [Op.gte]: totalGuests }
            }
        });

        return availableRooms;
    }
}
