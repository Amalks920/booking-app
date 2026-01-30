import { Request, Response } from 'express';
import { AmenityService } from '../../domain/services/AmenityService';
import { AuthenticatedRequest } from '../../../../types';

export class AmenityController {
  constructor(private amenityService: AmenityService) {}

  async createAmenity(req: Request, res: Response): Promise<void> {
    try {
      const amenityData = req.body;
      const user_id = (req as AuthenticatedRequest).user?.id || '';
      const amenity = await this.amenityService.createAmenity(amenityData, user_id);
      res.status(201).json({ message: 'Amenity created successfully', amenity });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown error' });
    }
  }

  async getAllAmenities(_req: Request, res: Response): Promise<void> {
    try {
      const amenities = await this.amenityService.getAllAmenities();
      res.status(200).json({ message: 'Get all amenities', amenities });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown error' });
    }
  }

  async getAmenityById(req: Request, res: Response): Promise<void> {
    try {
      const id: string = req.params['id'] as string;
      const amenity = await this.amenityService.getAmenityById(id);
      if (!amenity) {
        res.status(404).json({ error: 'Amenity not found' });
        return;
      }
      res.status(200).json({ message: `Get amenity with ID: ${id}`, amenity });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown error' });
    }
  }

  async updateAmenity(req: Request, res: Response): Promise<void> {
    try {
      const id: string = req.params['id'] as string;
      const amenityData = req.body;
      const amenity = await this.amenityService.updateAmenity(id, amenityData);
      if (!amenity) {
        res.status(404).json({ error: 'Amenity not found' });
        return;
      }
      res.status(200).json({ message: `Amenity ${id} updated successfully`, amenity });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown error' });
    }
  }

  async deleteAmenity(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params['id'] as string;
      const deleted = await this.amenityService.deleteAmenity(id);
      if (!deleted) {
        res.status(404).json({ error: 'Amenity not found' });
        return;
      }
      res.status(200).json({ message: `Amenity ${id} deleted successfully` });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown error' });
    }
  }
}

