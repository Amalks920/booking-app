
import { Sequelize } from 'sequelize';
import sequelize from '../config/database';
import { BookingRepositoryImpl } from '../modules/bookings/infrastructure/repositories/BookingRepository';
import PropertyModel from '../modules/properties/infrastructure/models/Property';
import RoomModel from '../modules/properties/infrastructure/models/Room';
import BookingModel from '../modules/bookings/infrastructure/models/Booking';
import User from '../modules/users/infrastructure/models/User';
import { v4 as uuidv4 } from 'uuid';

async function verifyAvailability() {
    try {
        await sequelize.authenticate();
        console.log('Database connected.');

        // 1. Setup Data
        const userId = uuidv4();
        const propertyId = uuidv4();
        const roomId = uuidv4();

        // Create Dummy User (if needed by FK constraints) but normally we just need IDs if constraints aren't enforced strictly in memory or if we can mock. 
        // However, since we are using real DB connection, we should create them.

        await User.create({
            id: userId,
            name: 'Test User',
            email: `test-${uuidv4()}@example.com`,
            password: 'password',
            role: 'user'
        });

        await PropertyModel.create({
            id: propertyId,
            owner_id: userId,
            property_name: 'Test Property',
            description: 'Test Desc',
            address: '123 Test St',
            city: 'Test City',
            state: 'Test State',
            country: 'Test Country',
            zip_code: '12345',
            price_per_night: 100,
            status: 'active' // Adjusted based on Property model requirements if any
        });

        await RoomModel.create({
            id: roomId,
            property_id: propertyId,
            name: 'Deluxe Room',
            description: 'A deluxe room',
            capacity: 4,
            room_number: 101,
            beds: '2 Queen',
            price_per_night: 150,
            status: 'available',
            max_adult_count: 2,
            max_children_under_3_count: 1,
            max_children_3_to_12_count: 1,
            max_children_13_to_17_count: 1,
            created_by: userId,
            updated_by: userId,
            room_type: 'deluxe',
            is_smoking_allowed: false,
            has_private_bathroom: true
        });

        console.log('Test data created.');

        const repo = new BookingRepositoryImpl();

        // 2. Test Case 1: Room is available (No bookings)
        console.log('\nTest Case 1: Room available (No bookings)');
        const result1 = await repo.findAvailableRoom(
            '2026-03-01',
            '2026-03-05',
            { adults: 2, children: [{ age: 2 }] }
        );
        console.log(`Found ${result1.length} rooms. Expecting at least 1 (ID: ${roomId})`);
        if (result1.find(r => r.id === roomId)) console.log('PASS'); else console.log('FAIL');

        // 3. Create a conflicting booking
        await BookingModel.create({
            id: uuidv4(),
            user_id: userId,
            room_id: roomId,
            check_in_date: new Date('2026-03-10'),
            check_out_date: new Date('2026-03-15'),
            total_amount: 500,
            status: 'confirmed'
        });
        console.log('Conflicting booking created (Mar 10 - Mar 15).');

        // 4. Test Case 2: Room is occupied (Overlapping dates)
        console.log('\nTest Case 2: Room occupied (Overlap Mar 12 - Mar 14)');
        const result2 = await repo.findAvailableRoom(
            '2026-03-12',
            '2026-03-14',
            { adults: 2, children: [] }
        );
        console.log(`Found ${result2.length} rooms.`);
        if (!result2.find(r => r.id === roomId)) console.log('PASS'); else console.log('FAIL');

        // 5. Test Case 3: Room available (Dates outside existing booking)
        console.log('\nTest Case 3: Room available (Mar 16 - Mar 20)');
        const result3 = await repo.findAvailableRoom(
            '2026-03-16',
            '2026-03-20',
            { adults: 2, children: [] }
        );
        console.log(`Found ${result3.length} rooms.`);
        if (result3.find(r => r.id === roomId)) console.log('PASS'); else console.log('FAIL');

        // 6. Test Case 4: Capacity Limits (Too many adults)
        console.log('\nTest Case 4: Capacity Limits (3 Adults, Max is 2)');
        const result4 = await repo.findAvailableRoom(
            '2026-03-20',
            '2026-03-25',
            { adults: 3, children: [] }
        );
        console.log(`Found ${result4.length} rooms.`);
        if (!result4.find(r => r.id === roomId)) console.log('PASS'); else console.log('FAIL');

        // 7. Test Case 5: Child Age Limits (Child 15yo, Max 13-17 is 1)
        console.log('\nTest Case 5: Child Age (1 Child age 15, Max 13-17 is 1) - Should Pass');
        const result5 = await repo.findAvailableRoom(
            '2026-03-20',
            '2026-03-25',
            { adults: 2, children: [{ age: 15 }] }
        );
        console.log(`Found ${result5.length} rooms.`);
        if (result5.find(r => r.id === roomId)) console.log('PASS'); else console.log('FAIL');

        // 8. Test Case 6: Child Age Limits (2 Children 15yo, Max 13-17 is 1)
        console.log('\nTest Case 6: Child Age (2 Children age 15, Max 13-17 is 1) - Should Fail');
        const result6 = await repo.findAvailableRoom(
            '2026-03-20',
            '2026-03-25',
            { adults: 2, children: [{ age: 15 }, { age: 15 }] }
        );
        console.log(`Found ${result6.length} rooms.`);
        if (!result6.find(r => r.id === roomId)) console.log('PASS'); else console.log('FAIL');

    } catch (error) {
        console.error('Test Failed:', error);
    } finally {
        // Cleanup if possible, or just leave it for dev DB reset
        // await sequelize.close();
    }
}

verifyAvailability();
