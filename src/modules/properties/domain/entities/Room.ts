// modules/room/domain/entities/Room.ts

export class Room {
  constructor(
    public id: string,
    public name: string,
    public description: string,
    public created_by: string,
    public updated_by: string,
    public created_at?: Date,
    public updated_at?: Date
  ) { }
}

// DTOs
export interface CreateRoomDto {
  property_id: string;
  name: string;
  description: string;
  capacity: number;
  room_number: number;
  beds: string;
  status?: 'available' | 'booked' | 'maintenance' | 'pending';
  floor_number?: number;
  size_sq_m?: number;
  view_type?: string;
  price_per_night: number;
  is_smoking_allowed: boolean;
  has_private_bathroom: boolean;
  max_adult_count: number;
  max_children_under_3_count: number;
  max_children_3_to_12_count: number;
  max_children_13_to_17_count: number;
}

export interface UpdateRoomDto {
  name?: string;
  description?: string;
  updated_by?: string;
}

// Repository contract
export interface IRoomRepository {
  findAll(): Promise<Room[]>;
  findById(id: number): Promise<Room | null>;
  create(roomData: CreateRoomDto, user_id: string): Promise<Room>;
  update(id: string, roomData: UpdateRoomDto): Promise<Room | null>;
  findPrice(id: string): Promise<number>;
  delete(id: string): Promise<boolean>;
}
