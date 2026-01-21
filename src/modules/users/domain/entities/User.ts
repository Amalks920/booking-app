export interface User {
  id: string;
  name: string;
  email: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserDto {
  name: string;
  email: string;
  password: string;
}

export interface UserProfileDto {
  firstName: string;
  lastName: string;
  countryCode: string;
  phoneNumber: string;
  roleId?: string;
}

export type CreateUserDto = UserDto & UserProfileDto;

export interface UpdateUserDto {
  name?: string;
  email?: string;
}

export interface UserRepository {
  findAll(): Promise<User[]>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(user: CreateUserDto): Promise<User>;
  update(id: string, user: UpdateUserDto): Promise<User | null>;
  delete(id: string): Promise<boolean>;
} 