// modules/property/application/controllers/PropertyController.ts
import { Request, Response } from 'express';
import { PropertyService } from '../../domain/services/PropertyService';
import { AuthenticatedRequest } from '../../../../types';

export class PropertyController {
  constructor(private propertyService: PropertyService) {}

  async getAllProperties(req: Request, res: Response): Promise<void> {
    try {
        req.params
      const properties = await this.propertyService.getAllProperties();
      res.json({
        message: 'Get all properties',
        properties
      });
    } catch (error) {
      res.status(500).json({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async getPropertyById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ error: 'Property ID is required' });
        return;
      }

      const property = await this.propertyService.getPropertyById(id);
      if (!property) {
        res.status(404).json({ error: 'Property not found' });
        return;
      }

      res.json({
        message: `Get property with ID: ${id}`,
        property
      });
    } catch (error) {
      res.status(500).json({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async createProperty(req: Request, res: Response): Promise<void> {
    try {
      const propertyData = req.body;
      const user_id = (req as AuthenticatedRequest).user?.id || '';
      const property = await this.propertyService.createProperty(propertyData,user_id);

      res.status(201).json({
        message: 'Property created successfully',
        property
      });
    } catch (error) {
      console.log(error);
      if (error instanceof Error && error.message.includes('required')) {
        res.status(400).json({ error: 'Validation error', message: error.message });
        return;
      }

      res.status(500).json({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async updateProperty(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ error: 'Property ID is required' });
        return;
      }

      const propertyData = req.body;
      const property = await this.propertyService.updateProperty(id, propertyData);

      if (!property) {
        res.status(404).json({ error: 'Property not found' });
        return;
      }

      res.json({
        message: `Property ${id} updated successfully`,
        property
      });
    } catch (error) {
      res.status(500).json({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async deleteProperty(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ error: 'Property ID is required' });
        return;
      }

      const deleted = await this.propertyService.deleteProperty(id);
      if (!deleted) {
        res.status(404).json({ error: 'Property not found' });
        return;
      }

      res.json({
        message: `Property ${id} deleted successfully`
      });
    } catch (error) {
      res.status(500).json({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}
