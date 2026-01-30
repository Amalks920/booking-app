import { z } from 'zod';

export const createRoomSchema = z.object({
  room_number: z.number().int().positive('Room number must be a positive integer'),
  description: z.string().min(1, 'Description is required'),
  beds: z.number().int().positive('Beds must be a positive integer'),
  property_id: z.string().uuid('Property ID must be a valid UUID'),
  name: z.string().min(1, 'Room name is required'),
  room_type: z.string().min(1, 'Room type is required'),
  price_per_night: z.number().positive('Price must be a positive number'),
  availability: z.boolean().default(true),
  capacity: z.number().int().positive('Capacity must be a positive integer'),
  floor_number: z.number().int().positive('Floor number must be a positive integer'),
  size_sq_m: z.number().positive('Size must be a positive number'),
  view_type: z.string().min(1, 'View type is required'),
  is_smoking_allowed: z.boolean().default(false),
  has_private_bathroom: z.boolean().default(true),
});
