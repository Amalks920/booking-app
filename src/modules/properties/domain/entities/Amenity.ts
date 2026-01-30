export class Amenity {
    constructor(
      public id: string,
      public name: string,
      public description: string,
      public created_by: string,
      public updated_by: string,
      public created_at?: Date,
      public updated_at?: Date
    ) {}
  }
  
  export interface CreateAmenityDto {
    name: string;
    description: string;
    created_by: string;
    updated_by: string;
  }
  
  export interface UpdateAmenityDto {
    name?: string;
    description?: string;
    updated_by?: string;
  }
  
  export interface IAmenityRepository {
    findAll(): Promise<Amenity[]>;
    findById(id: string): Promise<Amenity | null>;
    create(amenityData: CreateAmenityDto, user_id: string): Promise<Amenity>;
    update(id: string, amenityData: UpdateAmenityDto): Promise<Amenity | null>;
    delete(id: string): Promise<boolean>;
  }
