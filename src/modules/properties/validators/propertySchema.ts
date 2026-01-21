import { z } from 'zod';

export const createPropertySchema = z.object({
  property_name: z.string().min(1, 'property name is required'),
  description: z.string().min(1, 'description is required'),
  type: z.string().min(1, 'type is required'),
  address: z.string().min(1, 'address is required'),
  city: z.string().min(1, 'city is required'),
  state: z.string().min(1, 'state is required'),
  country: z.string().min(1, 'country is required'),
  pincode: z.string().min(1, 'pincode is required'),
  latitude: z.number().min(1, 'latitude is required'),
 // longitude: z.number().min(1, 'longitude is required'),
  contact_number: z.string().min(1, 'contact number is required'),
  status: z.string().min(1, 'status is required'),
});