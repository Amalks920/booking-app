import { CreateRoomDto, IRoomRepository, Room, UpdateRoomDto } from "../entities/Room";

export class RoomService {
  constructor(private roomRepository: IRoomRepository) {}

  async getAllRooms(): Promise<Room[]> {
    return this.roomRepository.findAll();
  }

  async getRoomById(id: number): Promise<Room | null> {
    return this.roomRepository.findById(id);
  }

  async createRoom(roomData: CreateRoomDto): Promise<Room> {
    return this.roomRepository.create(roomData);
  }

  async updateRoom(id: string, roomData: UpdateRoomDto): Promise<Room | null> {
    return this.roomRepository.update(id, roomData);
  }

  async deleteRoom(id: string): Promise<boolean> {
    return this.roomRepository.delete(id);
  }
}