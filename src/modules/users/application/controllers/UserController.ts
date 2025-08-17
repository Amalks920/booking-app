import { Request, Response } from 'express';
import { UserService } from '../../domain/services/UserService';

export class UserController {
  constructor(private userService: UserService) {}

  async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      req
      const users = await this.userService.getAllUsers();
      res.json({
        message: 'Get all users',
        users
      });
    } catch (error) {
      res.status(500).json({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ error: 'User ID is required' });
        return;
      }

      const userId = parseInt(id);
      if (isNaN(userId)) {
        res.status(400).json({ error: 'Invalid user ID format' });
        return;
      }

      const user = await this.userService.getUserById(userId);
      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      res.json({
        message: `Get user with ID: ${id}`,
        user
      });
    } catch (error) {
      res.status(500).json({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async createUser(req: Request, res: Response): Promise<void> {
    try {
      const { name, email } = req.body;
      const user = await this.userService.createUser({ name, email });
      
      res.status(201).json({
        message: 'User created successfully',
        user
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes('required')) {
        res.status(400).json({ error: 'Validation error', message: error.message });
        return;
      }
      if (error instanceof Error && error.message.includes('Invalid email')) {
        res.status(400).json({ error: 'Validation error', message: error.message });
        return;
      }
      
      res.status(500).json({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ error: 'User ID is required' });
        return;
      }

      const userId = parseInt(id);
      if (isNaN(userId)) {
        res.status(400).json({ error: 'Invalid user ID format' });
        return;
      }

      const { name, email } = req.body;
      const user = await this.userService.updateUser(userId, { name, email });
      
      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      res.json({
        message: `User ${id} updated successfully`,
        user
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes('Invalid email')) {
        res.status(400).json({ error: 'Validation error', message: error.message });
        return;
      }
      
      res.status(500).json({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ error: 'User ID is required' });
        return;
      }

      const userId = parseInt(id);
      if (isNaN(userId)) {
        res.status(400).json({ error: 'Invalid user ID format' });
        return;
      }

      const deleted = await this.userService.deleteUser(userId);
      if (!deleted) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      res.json({
        message: `User ${id} deleted successfully`
      });
    } catch (error) {
      res.status(500).json({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
} 