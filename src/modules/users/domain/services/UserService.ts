import { User, CreateUserDto, UpdateUserDto, UserRepository } from '../entities/User';

export class UserService {
  constructor(private userRepository: UserRepository) {}

  async getAllUsers(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  async getUserById(id: number): Promise<User | null> {
    if (!id || id <= 0) {
      throw new Error('Invalid user ID');
    }
    return this.userRepository.findById(id);
  }

  async createUser(userData: CreateUserDto): Promise<User> {
    if (!userData.name || !userData.email) {
      throw new Error('Name and email are required');
    }

    if (!this.isValidEmail(userData.email)) {
      throw new Error('Invalid email format');
    }

    return this.userRepository.create(userData);
  }

  async updateUser(id: number, userData: UpdateUserDto): Promise<User | null> {
    if (!id || id <= 0) {
      throw new Error('Invalid user ID');
    }

    if (userData.email && !this.isValidEmail(userData.email)) {
      throw new Error('Invalid email format');
    }

    return this.userRepository.update(id, userData);
  }

  async deleteUser(id: number): Promise<boolean> {
    if (!id || id <= 0) {
      throw new Error('Invalid user ID');
    }

    return this.userRepository.delete(id);
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
} 