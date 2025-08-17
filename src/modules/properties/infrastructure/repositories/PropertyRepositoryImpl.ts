// modules/property/infrastructure/repositories/PropertyRepositoryImpl.ts
import { Property, CreatePropertyDto, UpdatePropertyDto, IPropertyRepository } from '../../domain/entities/Property';
import PropertyModel from '../models/Property';

export class PropertyRepositoryImpl implements IPropertyRepository {
  async findAll(): Promise<Property[]> {
    const properties = await PropertyModel.findAll();
    return properties.map(p => new Property(
      p.id,
      p.property_name,
      p.description,
      p.type,
      p.address,
      p.city,
      p.state,
      p.country,
      p.pincode,
      p.latitude,
      p.longitude,
      p.contact_number,
      p.status,
      p.created_by,
      p.updated_by,
      p.created_at,
      p.updated_at
    ));
  }

  async findById(id: number): Promise<Property | null> {
    const property = await PropertyModel.findByPk(id);
    if (!property) return null;

    return new Property(
      property.id,
      property.property_name,
      property.description,
      property.type,
      property.address,
      property.city,
      property.state,
      property.country,
      property.pincode,
      property.latitude,
      property.longitude,
      property.contact_number,
      property.status,
      property.created_by,
      property.updated_by,
      property.created_at,
      property.updated_at
    );
  }

  async create(propertyData: CreatePropertyDto): Promise<Property> {
    const newProperty = await PropertyModel.create({
      property_name: propertyData.property_name,
      description: propertyData.description,
      type: propertyData.type,
      address: propertyData.address,
      city: propertyData.city,
      state: propertyData.state,
      country: propertyData.country,
      pincode: propertyData.pincode,
      latitude: propertyData.latitude,
      longitude: propertyData.longitude,
      contact_number: propertyData.contact_number,
      status: propertyData.status,
      created_by: propertyData.created_by,
      updated_by: propertyData.updated_by
    });

    return new Property(
      newProperty.id,
      newProperty.property_name,
      newProperty.description,
      newProperty.type,
      newProperty.address,
      newProperty.city,
      newProperty.state,
      newProperty.country,
      newProperty.pincode,
      newProperty.latitude,
      newProperty.longitude,
      newProperty.contact_number,
      newProperty.status,
      newProperty.created_by,
      newProperty.updated_by,
      newProperty.created_at,
      newProperty.updated_at
    );
  }

  async update(id: number, propertyData: UpdatePropertyDto): Promise<Property | null> {
    const property = await PropertyModel.findByPk(id);
    if (!property) return null;

    const updateData: Partial<Omit<Property, 'id' | 'created_at' | 'updated_at'>> = {};
    Object.assign(updateData, propertyData);

    const updatedProperty = await property.update(updateData);

    return new Property(
      updatedProperty.id,
      updatedProperty.property_name,
      updatedProperty.description,
      updatedProperty.type,
      updatedProperty.address,
      updatedProperty.city,
      updatedProperty.state,
      updatedProperty.country,
      updatedProperty.pincode,
      updatedProperty.latitude,
      updatedProperty.longitude,
      updatedProperty.contact_number,
      updatedProperty.status,
      updatedProperty.created_by,
      updatedProperty.updated_by,
      updatedProperty.created_at,
      updatedProperty.updated_at
    );
  }

  async delete(id: number): Promise<boolean> {
    const property = await PropertyModel.findByPk(id);
    if (!property) return false;

    await property.destroy();
    return true;
  }
}
