// modules/property/domain/services/PropertyService.ts
import { Property, CreatePropertyDto, UpdatePropertyDto, IPropertyRepository } from '../entities/Property';

export class PropertyService {
  constructor(private propertyRepository: IPropertyRepository) {}

  async getAllProperties(): Promise<Property[]> {
    return this.propertyRepository.findAll();
  }

  async getPropertyById(id: string): Promise<Property | null> {
    if (!id || id.trim() === '') {
      throw new Error('Invalid property ID');
    }
    return this.propertyRepository.findById(id);
  }

  async createProperty(propertyData: CreatePropertyDto): Promise<Property> {
    if (!propertyData.property_name || !propertyData.address || !propertyData.city || !propertyData.state) {
      throw new Error('Property name, address, city, and state are required');
    }

    return this.propertyRepository.create(propertyData);
  }

  async updateProperty(id: string, propertyData: UpdatePropertyDto): Promise<Property | null> {
    if (!id || id.trim() === '') {
      throw new Error('Invalid property ID');
    }

    return this.propertyRepository.update(id, propertyData);
  }

  async deleteProperty(id: string): Promise<boolean> {
    if (!id || id.trim() === '') {
      throw new Error('Invalid property ID');
    }

    return this.propertyRepository.delete(id);
  }
}
