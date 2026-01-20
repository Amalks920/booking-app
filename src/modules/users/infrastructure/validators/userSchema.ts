import { z } from 'zod';

export const createUserSchema = z.object({
  name: z.string().min(1, 'name is required'),
  email: z.string().email('email must be a valid email address'),
  password: z.string().min(1, 'password is required'),
  firstName: z.string().min(1, 'firstName is required'),
  lastName: z.string().min(1, 'lastName is required'),
  countryCode: z.string().min(1, 'countryCode is required'),
  phoneNumber: z.string().min(1, 'phoneNumber is required')
});

