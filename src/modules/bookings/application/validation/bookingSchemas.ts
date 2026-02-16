import { z } from 'zod';

export const createOrderInput = z.object({
    check_in_date: z.string().refine((date) => !isNaN(Date.parse(date)), { message: "Invalid check-in date format" }),
    check_out_date: z.string().refine((date) => !isNaN(Date.parse(date)), { message: "Invalid check-out date format" }),
    room_id: z.string().min(1, "Room ID is required"),
    user_id: z.string().min(1, "User ID is required"),
    guests: z.object({
        adults: z.number().int().positive("Number of adults must be positive"),
        children: z.array(z.object({
            age: z.number().int().nonnegative("Age must be non-negative")
        })).optional()
    })
});

export type CreateOrderInput = z.infer<typeof createOrderInput>;
