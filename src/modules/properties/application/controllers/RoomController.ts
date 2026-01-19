import { RoomService } from "../../domain/services/RoomService";
import { Request, Response } from "express";
export class RoomController {
    constructor(private roomService: RoomService) {}

    async getAllRooms(_req: Request, res: Response): Promise<void> {
    try {
      const rooms = await this.roomService.getAllRooms();
      res.json({
        message: 'Get all rooms',
        rooms
      });
    } catch (error) {
      res.status(500).json({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async getRoomById(req: Request, res: Response): Promise<void> {
    try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ error: 'Room ID is required' });
      return;
    }
    const roomId = parseInt(id);
    if (isNaN(roomId)) {
      res.status(400).json({ error: 'Invalid room ID format' });
      return;
    }
    const room = await this.roomService.getRoomById(roomId);
      res.json(room);
    } catch (error) {
      res.status(500).json({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async createRoom(req: Request, res: Response): Promise<void> {
    try {
      const roomData = req.body;
      const room = await this.roomService.createRoom(roomData);
      res.json(room);
    } catch (error) {
      res.status(500).json({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async updateRoom(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const roomData = req.body;
      if (!id) {
        res.status(400).json({ error: 'Room ID is required' });
        return;
      }
      const room = await this.roomService.updateRoom(id, roomData);
      res.json(room);
    } catch (error) {
      res.status(500).json({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async deleteRoom(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ error: 'Room ID is required' });
        return;
      }
      const room = await this.roomService.deleteRoom(id);
      res.json(room);
    } catch (error) {
      res.status(500).json({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}