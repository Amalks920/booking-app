import { AuthenticatedRequest } from "../../../../types";
import { BedService } from "../../domain/services/BedService";
import { Request, Response } from "express";

export class BedController {
    constructor(private bedService: BedService) { }

    async getAllBeds(_req: Request, res: Response): Promise<void> {
        try {
            const beds = await this.bedService.getAllBeds();
            res.json({
                message: 'Get all beds',
                beds
            });
        } catch (error) {
            res.status(500).json({
                error: 'Internal server error',
                message: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }

    async getBedById(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            if (!id) {
                res.status(400).json({ error: 'Bed ID is required' });
                return;
            }

            const bed = await this.bedService.getBedById(id);
            if (!bed) {
                res.status(404).json({ error: 'Bed not found' });
                return;
            }
            res.json(bed);
        } catch (error) {
            res.status(500).json({
                error: 'Internal server error',
                message: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }

    async getBedsByRoomId(req: Request, res: Response): Promise<void> {
        try {
            const { roomId } = req.params;
            if (!roomId) {
                res.status(400).json({ error: 'Room ID is required' });
                return;
            }
            const beds = await this.bedService.getBedsByRoomId(roomId);
            res.json({
                message: `Get beds for room ${roomId}`,
                beds
            });
        } catch (error) {
            res.status(500).json({
                error: 'Internal server error',
                message: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }

    async createBed(req: Request, res: Response): Promise<void> {
        try {
            const bedData = req.body;
            const user_id = (req as AuthenticatedRequest).user?.id || '';
            const bed = await this.bedService.createBed(bedData, user_id);
            res.json(bed);
        } catch (error) {
            console.error(error);
            res.status(500).json({
                error: 'Internal server error',
                message: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }

    async updateBed(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const bedData = req.body;
            const user_id = (req as AuthenticatedRequest).user?.id || '';

            if (!id) {
                res.status(400).json({ error: 'Bed ID is required' });
                return;
            }
            const bed = await this.bedService.updateBed(id, bedData, user_id);
            if (!bed) {
                res.status(404).json({ error: 'Bed not found' });
                return;
            }
            res.json(bed);
        } catch (error) {
            res.status(500).json({
                error: 'Internal server error',
                message: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }

    async deleteBed(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            if (!id) {
                res.status(400).json({ error: 'Bed ID is required' });
                return;
            }
            const result = await this.bedService.deleteBed(id);
            if (!result) {
                res.status(404).json({ error: 'Bed not found' });
                return;
            }
            res.json({ message: 'Bed deleted successfully' });
        } catch (error) {
            res.status(500).json({
                error: 'Internal server error',
                message: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
}
