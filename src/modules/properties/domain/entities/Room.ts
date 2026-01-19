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
  ) {}
}

// DTOs
export interface CreateRoomDto {
  id?: string;
  name: string;
  description: string;
  created_by: string;
  updated_by: string;
  // Required by persistence model
  property_id: string;
  type: string;
  capacity: number;
  beds: string;
  price_per_night: number;
  currency: string;
  is_smoking_allowed: boolean;
  has_private_bathroom: boolean;
  status?: 'available' | 'booked' | 'maintenance';
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
  create(roomData: CreateRoomDto): Promise<Room>;
  update(id: string, roomData: UpdateRoomDto): Promise<Room | null>;
  delete(id: string): Promise<boolean>;
}
  