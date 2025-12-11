import { User, CreateUserDto, UpdateUserDto, UserRepository } from '../entities/User';
import { CognitoService } from '../../../authentication/domain/services/CognitoService';

export class UserService {
  constructor(
    private userRepository: UserRepository,
    private cognitoService?: CognitoService
  ) {}

  async getAllUsers(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  async getUserById(id: number): Promise<User | null> {
    if (!id || id <= 0) {
      throw new Error('Invalid user ID');
    }
    return this.userRepository.findById(id);
  }

  async createUser(userData: CreateUserDto & { password?: string; phoneNumber?: string }): Promise<User> {
    if (!userData.name || !userData.email) {
      throw new Error('Name and email are required');
    }

    if (!this.isValidEmail(userData.email)) {
      throw new Error('Invalid email format');
    }

    // If CognitoService is provided and password is given, create user in Cognito first
    if (this.cognitoService && userData.password) {
      try {
        const cognitoParams: {
          email: string;
          password: string;
          name: string;
          phoneNumber?: string;
          temporaryPassword: boolean;
        } = {
          email: userData.email,
          password: userData.password,
          name: userData.name,
          temporaryPassword: false
        };
        
        if (userData.phoneNumber) {
          cognitoParams.phoneNumber = userData.phoneNumber;
        }
        
        await this.cognitoService.createUser(cognitoParams);
      } catch (error) {
        // If Cognito creation fails, throw error before creating in database
        throw new Error(
          error instanceof Error 
            ? `Failed to create user in Cognito: ${error.message}` 
            : 'Failed to create user in Cognito: Unknown error'
        );
      }
    }

    // Create user in database
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