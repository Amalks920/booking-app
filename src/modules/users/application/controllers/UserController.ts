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
      const { name, email, password, firstName, lastName, countryCode, phoneNumber } = req.body;
      
      // Build phoneNumber from country_code and phone_number if both are provided
      
      const user = await this.userService.createUser({ 
        name, 
        email, 
        password,
        firstName,
        lastName,
        countryCode,
        phoneNumber,
      });
      
      res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: user,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes('required')) {
        res.status(400).json({ 
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: error.message
          },
          timestamp: new Date().toISOString()
        });
        return;
      }
      if (error instanceof Error && error.message.includes('Invalid email')) {
        res.status(400).json({ 
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: error.message
          },
          timestamp: new Date().toISOString()
        });
        return;
      }
      if (error instanceof Error && error.message.includes('Cognito')) {
        res.status(500).json({ 
          success: false,
          error: {
            code: 'COGNITO_ERROR',
            message: error.message
          },
          timestamp: new Date().toISOString()
        });
        return;
      }
      
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error'
        },
        timestamp: new Date().toISOString()
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

  async signIn(req: Request, res: Response): Promise<void> {
    try {
      const { username, email, password } = req.body;
      
      // Use username or email (username can be email or actual username)
      const usernameOrEmail = username || email;
      
      if (!usernameOrEmail || !password) {
        res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Username/email and password are required'
          },
          timestamp: new Date().toISOString()
        });
        return;
      }

      const result = await this.userService.signIn(usernameOrEmail, password);
      
      res.status(200).json({
        success: true,
        message: 'Sign in successful',
        data: {
          user: result.user,
          tokens: result.tokens
        },
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('required')) {
          res.status(400).json({
            success: false,
            error: {
              code: 'VALIDATION_ERROR',
              message: error.message
            },
            timestamp: new Date().toISOString()
          });
          return;
        }
        if (error.message.includes('Invalid username or password') || 
            error.message.includes('User not found') ||
            error.message.includes('not found')) {
          res.status(401).json({
            success: false,
            error: {
              code: 'UNAUTHORIZED',
              message: error.message
            },
            timestamp: new Date().toISOString()
          });
          return;
        }
        if (error.message.includes('not confirmed')) {
          res.status(403).json({
            success: false,
            error: {
              code: 'FORBIDDEN',
              message: error.message
            },
            timestamp: new Date().toISOString()
          });
          return;
        }
        if (error.message.includes('CognitoService is not configured')) {
          res.status(500).json({
            success: false,
            error: {
              code: 'CONFIGURATION_ERROR',
              message: error.message
            },
            timestamp: new Date().toISOString()
          });
          return;
        }
      }
      
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error'
        },
        timestamp: new Date().toISOString()
      });
    }
  }


  async refreshTokens(req: Request, res: Response): Promise<void> {
    try {
      const { refreshToken, username } = req.body;
      
      if (!refreshToken) {
        res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Refresh token is required'
          },
          timestamp: new Date().toISOString()
        });
        return;
      }

      if (!username) {
        res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Username is required'
          },
          timestamp: new Date().toISOString()
        });
        return;
      }

      const tokens = await this.userService.refreshTokens(refreshToken, username);
      res.status(200).json({
        success: true,
        message: 'Tokens refreshed successfully',
        data: tokens
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error'
        },
        timestamp: new Date().toISOString()
      });
    }
  }
} 
