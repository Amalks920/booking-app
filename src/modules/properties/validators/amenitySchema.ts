import { z } from 'zod';

export const createAmenitySchema = z.object({
  name: z.string().min(1, 'Amenity name is required'),
  description: z.string().min(1, 'Amenity description is required'),
});

export const updateAmenitySchema = z.object({
  name: z.string().min(1, 'Amenity name is required').optional(),
  description: z.string().min(1, 'Amenity description is required').optional(),
});
