// modules/property/domain/entities/Property.ts
export class Property {
    constructor(
      public id: string,
      public property_name: string,
      public description: string,
      public type: string,
      public address: string,
      public city: string,
      public state: string,
      public country: string,
      public pincode: string,
      public latitude: number,
      public longitude: number,
      public contact_number: string,
      public status: 'active' | 'inactive',
      public created_by: number,
      public updated_by: number,
      public created_at?: Date,
      public updated_at?: Date
    ) {}
  }
  
  // DTOs
  export interface CreatePropertyDto {
    property_name: string;
    description: string;
    type: string;
    address: string;
    city: string;
    state: string;
    country: string;
    pincode: string;
    latitude: number;
    longitude: number;
    contact_number: string;
    status: 'active' | 'inactive';
    created_by: number;
    updated_by: number;
  }
  
  export interface UpdatePropertyDto {
    property_name?: string;
    description?: string;
    type?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    pincode?: string;
    latitude?: number;
    longitude?: number;
    contact_number?: string;
    status?: 'active' | 'inactive';
    updated_by?: number;
  }
  
  export interface IPropertyRepository {
    findAll(): Promise<Property[]>;
    findById(id: string): Promise<Property | null>;
    create(propertyData: CreatePropertyDto): Promise<Property>;
    update(id: string, propertyData: UpdatePropertyDto): Promise<Property | null>;
    delete(id: string): Promise<boolean>;
  }