import { Amenity, CreateAmenityDto, UpdateAmenityDto, IAmenityRepository } from '../../domain/entities/Amenity';
import AmenityModel from '../models/Amenity';

export class AmenityRepositoryImpl implements IAmenityRepository {
  async findAll(): Promise<Amenity[]> {
    const amenities = await AmenityModel.findAll();
    return amenities.map(a => new Amenity(
      a.id,
      a.name,
      a.description,
      a.created_by,
      a.updated_by,
      a.created_at,
      a.updated_at
    ));
  }

  async findById(id: string): Promise<Amenity | null> {
    const amenity = await AmenityModel.findByPk(id);
    if (!amenity) return null;

    return new Amenity(
      amenity.id,
      amenity.name,
      amenity.description,
      amenity.created_by,
      amenity.updated_by,
      amenity.created_at,
      amenity.updated_at
    );
  }

  async create(amenityData: CreateAmenityDto, user_id: string): Promise<Amenity> {
    console.log(user_id, 'user_id in create');
    console.log(amenityData)
    let newAmenity: any = {}
    try {
      newAmenity = await AmenityModel.create({
        name: amenityData.name,
        description: amenityData.description,
        created_by: user_id,
        updated_by: user_id,
      });
    } catch (error) {
      console.log(error)
    }

    return {
      id: newAmenity?.id,
      name: newAmenity?.name,
      description: newAmenity?.description,
      created_by: newAmenity?.created_by,
      updated_by: newAmenity?.updated_by,
      created_at: newAmenity?.created_at,
      updated_at: newAmenity?.updated_at,
    }

    // return new Amenity(
    //   newAmenity.id,
    //   newAmenity.name,
    //     newAmenity.description,
    //     user_id,
    //     user_id,
    //     newAmenity.created_at,
    //     newAmenity.updated_at,
    // );
  }

  async update(id: string, amenityData: UpdateAmenityDto): Promise<Amenity | null> {
    const amenity = await AmenityModel.findByPk(id);
    if (!amenity) return null;

    const updatedAmenity = await amenity.update(amenityData);

    return new Amenity(
      updatedAmenity.id,
      updatedAmenity.name,
      updatedAmenity.description,
      updatedAmenity.created_by,
      updatedAmenity.updated_by,
      updatedAmenity.created_at,
      updatedAmenity.updated_at
    );
  }

  async delete(id: string): Promise<boolean> {
    const amenity = await AmenityModel.findByPk(id);
    if (!amenity) return false;

    await amenity.destroy();
    return true;
  }
}

