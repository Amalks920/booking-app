import { z } from 'zod';

export const createBedSchema = z.object({
    room_id: z.string().uuid('Room ID must be a valid UUID'),
    bed_type: z.string().min(1, 'Bed type is required'),
    quantity: z.coerce.number().int().positive('Quantity must be a positive integer'),
});

export const updateBedSchema = z.object({
    bed_type: z.string().min(1, 'Bed type is required').optional(),
    quantity: z.coerce.number().int().positive('Quantity must be a positive integer').optional(),
});
