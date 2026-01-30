import { Amenity, CreateAmenityDto, UpdateAmenityDto, IAmenityRepository } from '../entities/Amenity';

export class AmenityService {
  constructor(private amenityRepository: IAmenityRepository) {}

  async createAmenity(amenityData: CreateAmenityDto, user_id: string): Promise<Amenity> {
    return this.amenityRepository.create(amenityData, user_id);
  }

  async getAllAmenities(): Promise<Amenity[]> {
    return this.amenityRepository.findAll();
  }

  async getAmenityById(id: string): Promise<Amenity | null> {
    return this.amenityRepository.findById(id);
  }

  async updateAmenity(id: string, amenityData: UpdateAmenityDto): Promise<Amenity | null> {
    return this.amenityRepository.update(id, amenityData);
  }

  async deleteAmenity(id: string): Promise<boolean> {
    return this.amenityRepository.delete(id);
  }
}

