import { UserProfile, CreateUserProfileDto, UpdateUserProfileDto, UserProfileRepository } from '../../domain/entities/User_Profile';
import UserProfileModel from '../models/User_Profile';

export class UserProfileRepositoryImpl implements UserProfileRepository {
  async findAll(): Promise<UserProfile[]> {
    const profiles = await UserProfileModel.findAll();
    return profiles.map(profile => ({
      id: profile.id,
      userId: profile.userId,
      first_name: profile.firstName,
      last_name: profile.lastName,
      email: profile.email,
      country_code: profile.countryCode,
      phone_number: profile.phoneNumber,
      created_by: profile.createdBy || 0,
      updated_by: profile.updatedBy || 0,
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
    }));
  }

  async findById(id: number): Promise<UserProfile | null> {
    const profile = await UserProfileModel.findByPk(id);
    if (!profile) return null;

    return {
      id: profile.id,
      userId: profile.userId,
      first_name: profile.firstName,
      last_name: profile.lastName,
      email: profile.email,
      country_code: profile.countryCode,
      phone_number: profile.phoneNumber,
      created_by: profile.createdBy || 0,
      updated_by: profile.updatedBy || 0,
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
    };
  }

  async create(profileData: CreateUserProfileDto): Promise<UserProfile> {
    const newProfile = await UserProfileModel.create({
      userId: profileData.userId,
      firstName: profileData.bio || '',
      lastName: profileData.bio || '',
      email: '',
      countryCode: '',
      phoneNumber: profileData.phone || '',
      createdBy: 0,
      updatedBy: 0,
    });

    return {
      id: newProfile.id,
      userId: newProfile.userId,
      first_name: newProfile.firstName,
      last_name: newProfile.lastName,
      email: newProfile.email,
      country_code: newProfile.countryCode,
      phone_number: newProfile.phoneNumber,
      created_by: newProfile.createdBy || 0,
      updated_by: newProfile.updatedBy || 0,
      createdAt: newProfile.createdAt,
      updatedAt: newProfile.updatedAt,
    };
  }

  async update(id: number, profileData: UpdateUserProfileDto): Promise<UserProfile | null> {
    const profile = await UserProfileModel.findByPk(id);
    if (!profile) return null;

    const updateData: any = {};
    if (profileData.bio !== undefined) updateData.firstName = profileData.bio;
    if (profileData.phone !== undefined) updateData.phoneNumber = profileData.phone;
    if (profileData.address !== undefined) updateData.lastName = profileData.address;

    const updatedProfile = await profile.update(updateData);

    return {
      id: updatedProfile.id,
      userId: updatedProfile.userId,
      first_name: updatedProfile.firstName,
      last_name: updatedProfile.lastName,
      email: updatedProfile.email,
      country_code: updatedProfile.countryCode,
      phone_number: updatedProfile.phoneNumber,
      created_by: updatedProfile.createdBy || 0,
      updated_by: updatedProfile.updatedBy || 0,
      createdAt: updatedProfile.createdAt,
      updatedAt: updatedProfile.updatedAt,
    };
  }

  async delete(id: number): Promise<boolean> {
    const profile = await UserProfileModel.findByPk(id);
    if (!profile) return false;

    await profile.destroy();
    return true;
  }

  async findByUserId(userId: number): Promise<UserProfile | null> {
    const profile = await UserProfileModel.findOne({ where: { userId } });
    if (!profile) return null;

    return {
      id: profile.id,
      userId: profile.userId,
      first_name: profile.firstName,
      last_name: profile.lastName,
      email: profile.email,
      country_code: profile.countryCode,
      phone_number: profile.phoneNumber,
      created_by: profile.createdBy || 0,
      updated_by: profile.updatedBy || 0,
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
    };
  }
}
