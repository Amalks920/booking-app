export interface Booking {
  id: string;
  user_id: string;
  property_id: string;
  check_in_date: Date;
  check_out_date: Date;
  total_amount: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  created_at?: Date;
  updated_at?: Date;
}

export interface CreateBookingDto {
  user_id: string;
  property_id: string;
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

export interface IBookingRepository {
  findAll(): Promise<Booking[]>;
  findById(id: string): Promise<Booking | null>;
  findByUserId(userId: string): Promise<Booking[]>;
  findByPropertyId(propertyId: string): Promise<Booking[]>;
  create(booking: CreateBookingDto): Promise<Booking>;
  update(id: string, booking: UpdateBookingDto): Promise<Booking | null>;
  delete(id: string): Promise<boolean>;
  findAvailableRoom(check_in_date: string, check_out_date: string, guests: { adults: number, children: { age: number }[] }): Promise<any[]>;
} 