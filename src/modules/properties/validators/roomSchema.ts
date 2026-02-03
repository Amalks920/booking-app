import { z } from 'zod';

const resilientBoolean = z.preprocess((val) => {
  if (typeof val === 'string') {
    if (val.toLowerCase() === 'true') return true;
    if (val.toLowerCase() === 'false') return false;
  }
  return val;
}, z.boolean());

export const createRoomSchema = z.object({
  room_number: z.coerce.number().int().positive('Room number must be a positive integer'),
  description: z.string().min(1, 'Description is required'),
  beds: z.coerce.number().int().positive('Beds must be a positive integer'),
  property_id: z.string().uuid('Property ID must be a valid UUID'),
  name: z.string().min(1, 'Room name is required'),
  price_per_night: z.coerce.number().positive('Price must be a positive number'),
  availability: resilientBoolean.default(true),
  capacity: z.coerce.number().int().positive('Capacity must be a positive integer'),
  floor_number: z.coerce.number().int().positive('Floor number must be a positive integer'),
  size_sq_m: z.coerce.number().positive('Size must be a positive number'),
  max_adult_count: z.coerce.number().int().nonnegative('Max adult count must be a non-negative integer'),
  max_children_under_3_count: z.coerce.number().int().nonnegative('Max children under 3 count must be a non-negative integer'),
  max_children_3_to_12_count: z.coerce.number().int().nonnegative('Max children 3-12 count must be a non-negative integer'),
  max_children_13_to_17_count: z.coerce.number().int().nonnegative('Max children 13-17 count must be a non-negative integer'),
  view_type: z.string().min(1, 'View type is required'),
  is_smoking_allowed: resilientBoolean.default(false),
  has_private_bathroom: resilientBoolean.default(true),
});
