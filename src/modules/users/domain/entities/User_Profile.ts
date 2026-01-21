//import { UserProfile, CreateUserProfileDto, UpdateUserProfileDto, UserProfileRepository } from '../../domain/entities/UserProfile';
export interface UserProfile {
    id: string;
    userId: string; // foreign key to User
    first_name: string;
    last_name: string;
    email: string;
    country_code: string;
    phone_number: string;
    created_by: string | null;
    updated_by: string | null;
    createdAt?: Date;
    updatedAt?: Date;
  }
  
//   id: profile.id,
//   userId: profile.userId,
//   firstName: profile.firstName,
//   lastName: profile.lastName,
//   email: profile.email,
//   countryCode: profile.countryCode,
//   phoneNumber: profile.phoneNumber,
//   createdBy: profile.createdBy,
//   updatedBy: profile.updatedBy,
//   createdAt: profile.createdAt,
//   updatedAt: profile.updatedAt,
  export interface CreateUserProfileDto {
    userId: string;   // link profile to a user
    bio?: string;
    phone?: string;
    address?: string;
  }
  
  export interface UpdateUserProfileDto {
    bio?: string;
    phone?: string;
    address?: string;
  }
  
  export interface UserProfileRepository {
    findAll(): Promise<UserProfile[]>;
    findById(id: string): Promise<UserProfile | null>;
    findByUserId(userId: string): Promise<UserProfile | null>;
    create(profile: CreateUserProfileDto): Promise<UserProfile>;
    update(id: string, profile: UpdateUserProfileDto): Promise<UserProfile | null>;
    delete(id: string): Promise<boolean>;
  }
  