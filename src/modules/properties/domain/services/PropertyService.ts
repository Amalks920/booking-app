// modules/property/domain/services/PropertyService.ts
import { Property, CreatePropertyDto, UpdatePropertyDto, IPropertyRepository } from '../entities/Property';

export class PropertyService {
  constructor(private propertyRepository: IPropertyRepository) {}

  async getAllProperties(): Promise<Property[]> {
    return this.propertyRepository.findAll();
  }

  async getPropertyById(id: number): Promise<Property | null> {
    if (!id || id <= 0) {
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

  async updateProperty(id: number, propertyData: UpdatePropertyDto): Promise<Property | null> {
    if (!id || id <= 0) {
      throw new Error('Invalid property ID');
    }

    return this.propertyRepository.update(id, propertyData);
  }

  async deleteProperty(id: number): Promise<boolean> {
    if (!id || id <= 0) {
      throw new Error('Invalid property ID');
    }

    return this.propertyRepository.delete(id);
  }
}
