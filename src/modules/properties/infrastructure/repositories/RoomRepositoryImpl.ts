// modules/room/infrastructure/repositories/RoomRepositoryImpl.ts
import { Room, CreateRoomDto, UpdateRoomDto, IRoomRepository } from '../../domain/entities/Room';
import RoomModel from '../models/Room';

export class RoomRepositoryImpl implements IRoomRepository {
  async findAll(): Promise<Room[]> {
    const rooms = await RoomModel.findAll();
    return rooms.map(r => new Room(
      r.id,
      r.name,
      r.description || '',
      r.created_by,
      r.updated_by,
      r.created_at,
      r.updated_at
    ));
  }

  async findById(id: number): Promise<Room | null> {
    const room = await RoomModel.findByPk(id);
    if (!room) return null;

    return new Room(
      room.id,
      room.name,
      room.description || '',
      room.created_by,
      room.updated_by,
      room.created_at,
      room.updated_at
    );
  }

  async create(roomData: CreateRoomDto, user_id: string): Promise<Room> {
    const newRoom = await RoomModel.create({
      property_id: roomData.property_id,
      name: roomData.name,
      description: roomData.description,
      capacity: roomData.capacity,
      beds: roomData.beds,
      room_number: roomData.room_number,
      price_per_night: roomData.price_per_night,
      status: roomData.status ?? 'available',
      is_smoking_allowed: roomData.is_smoking_allowed,
      has_private_bathroom: roomData.has_private_bathroom,
      max_adult_count: roomData.max_adult_count,
      max_children_under_3_count: roomData.max_children_under_3_count,
      max_children_3_to_12_count: roomData.max_children_3_to_12_count,
      max_children_13_to_17_count: roomData.max_children_13_to_17_count,
      created_by: user_id,
      updated_by: user_id
    });

    return new Room(
      newRoom.id,
      newRoom.name,
      newRoom.description || '',
      newRoom.created_by,
      newRoom.updated_by,
      newRoom.created_at,
      newRoom.updated_at
    );
  }

  async update(id: string, roomData: UpdateRoomDto): Promise<Room | null> {
    const room = await RoomModel.findByPk(id);
    if (!room) return null;

    const updateData: Partial<Omit<Room, 'id' | 'created_at' | 'updated_at'>> = {};
    Object.assign(updateData, roomData);

    const updatedRoom = await room.update(updateData as any);

    return new Room(
      updatedRoom.id,
      updatedRoom.name,
      updatedRoom.description || '',
      updatedRoom.created_by,
      updatedRoom.updated_by,
      updatedRoom.created_at,
      updatedRoom.updated_at
    );
  }

  async delete(id: string): Promise<boolean> {
    const room = await RoomModel.findByPk(id);
    if (!room) return false;

    await room.destroy();
    return true;
  }
}
