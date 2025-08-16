import { User, CreateUserDto, UpdateUserDto, UserRepository } from '../../domain/entities/User';
import UserModel from '../models/User';

export class UserRepositoryImpl implements UserRepository {
  async findAll(): Promise<User[]> {
    const users = await UserModel.findAll();
    return users.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }));
  }

  async findById(id: number): Promise<User | null> {
    const user = await UserModel.findByPk(id);
    if (!user) {
      return null;
    }
    
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  }

  async create(userData: CreateUserDto): Promise<User> {
    const newUser = await UserModel.create({
      name: userData.name,
      email: userData.email
    });

    return {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt
    };
  }

  async update(id: number, userData: UpdateUserDto): Promise<User | null> {
    const user = await UserModel.findByPk(id);
    if (!user) {
      return null;
    }

    const updateData: { name?: string; email?: string } = {};
    if (userData.name !== undefined) {
      updateData.name = userData.name;
    }
    if (userData.email !== undefined) {
      updateData.email = userData.email;
    }

    const updatedUser = await user.update(updateData);

    return {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt
    };
  }

  async delete(id: number): Promise<boolean> {
    const user = await UserModel.findByPk(id);
    if (!user) {
      return false;
    }

    await user.destroy();
    return true;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await UserModel.findOne({ where: { email } });
    if (!user) {
      return null;
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  }
} 