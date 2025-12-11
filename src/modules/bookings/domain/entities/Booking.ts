export interface Booking {
  id: number;
  user_id: number;
  property_id: number;
  check_in_date: Date;
  check_out_date: Date;
  total_amount: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  created_at?: Date;
  updated_at?: Date;
}

export interface CreateBookingDto {
  user_id: number;
  property_id: number;
  check_in_date: Date;
  check_out_date: Date;
  total_amount: number;
  status?: 'pending' | 'confirmed' | 'cancelled' | 'completed';
}

export interface UpdateBookingDto {
  check_in_date?: Date;
  check_out_date?: Date;
  total_amount?: number;
  status?: 'pending' | 'confirmed' | 'cancelled' | 'completed';
}

export interface BookingRepository {
  findAll(): Promise<Booking[]>;
  findById(id: number): Promise<Booking | null>;
  findByUserId(userId: number): Promise<Booking[]>;
  findByPropertyId(propertyId: number): Promise<Booking[]>;
  create(booking: CreateBookingDto): Promise<Booking>;
  update(id: number, booking: UpdateBookingDto): Promise<Booking | null>;
  delete(id: number): Promise<boolean>;
} 