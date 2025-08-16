import { Request, Response } from 'express';
import { RoleService } from '../../domain/services/RoleService';

export class RoleController {
  constructor(private roleService: RoleService) {}

  async getAllRoles(req: Request, res: Response): Promise<void> {
    try {
      const roles = await this.roleService.getAllRoles();
      
      res.status(200).json({
        success: true,
        data: roles,
        message: 'Get all roles',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An unexpected error occurred',
          details: []
        },
        timestamp: new Date().toISOString()
      });
    }
  }

  async getRoleById(req: Request, res: Response): Promise<void> {
    try {
      const idParam = req.params['id'];
      if (!idParam) {
        res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Role ID is required',
            details: [
              {
                field: 'id',
                message: 'Role ID parameter is missing'
              }
            ]
          },
          timestamp: new Date().toISOString()
        });
        return;
      }

      const id = parseInt(idParam);
      
      if (!id || id <= 0) {
        res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Role ID is required',
            details: [
              {
                field: 'id',
                message: 'Role ID must be a positive integer'
              }
            ]
          },
          timestamp: new Date().toISOString()
        });
        return;
      }

      const role = await this.roleService.getRoleById(id);
      
      if (!role) {
        res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Role not found',
            details: [
              {
                field: 'id',
                message: `Role with ID ${id} does not exist`
              }
            ]
          },
          timestamp: new Date().toISOString()
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: role,
        message: `Get role with ID: ${id}`,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An unexpected error occurred',
          details: []
        },
        timestamp: new Date().toISOString()
      });
    }
  }

  async createRole(req: Request, res: Response): Promise<void> {
    try {
      const { role, code, created_by, updated_by } = req.body;
      const newRole = await this.roleService.createRole({ role, code, created_by, updated_by });
      
      res.status(201).json({
        success: true,
        data: newRole,
        message: 'Role created successfully',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes('required')) {
        res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Validation failed',
            details: [
              {
                field: 'role',
                message: 'Role name is required'
              },
              {
                field: 'code',
                message: 'Role code is required'
              },
              {
                field: 'created_by',
                message: 'Created by is required'
              },
              {
                field: 'updated_by',
                message: 'Updated by is required'
              }
            ]
          },
          timestamp: new Date().toISOString()
        });
        return;
      }

      if (error instanceof Error && error.message.includes('alphanumeric')) {
        res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Validation failed',
            details: [
              {
                field: 'code',
                message: 'Role code must be uppercase and alphanumeric'
              }
            ]
          },
          timestamp: new Date().toISOString()
        });
        return;
      }
      
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An unexpected error occurred',
          details: []
        },
        timestamp: new Date().toISOString()
      });
    }
  }

  async updateRole(req: Request, res: Response): Promise<void> {
    try {
      const idParam = req.params['id'];
      if (!idParam) {
        res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Role ID is required',
            details: [
              {
                field: 'id',
                message: 'Role ID parameter is missing'
              }
            ]
          },
          timestamp: new Date().toISOString()
        });
        return;
      }

      const id = parseInt(idParam);
      const { role, code } = req.body;
      
      if (!id || id <= 0) {
        res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Role ID is required',
            details: [
              {
                field: 'id',
                message: 'Role ID must be a positive integer'
              }
            ]
          },
          timestamp: new Date().toISOString()
        });
        return;
      }

      const updatedRole = await this.roleService.updateRole(id, { role, code });
      
      if (!updatedRole) {
        res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Role not found',
            details: [
              {
                field: 'id',
                message: `Role with ID ${id} does not exist`
              }
            ]
          },
          timestamp: new Date().toISOString()
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: updatedRole,
        message: `Role ${id} updated successfully`,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes('alphanumeric')) {
        res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Validation failed',
            details: [
              {
                field: 'code',
                message: 'Role code must be uppercase and alphanumeric'
              }
            ]
          },
          timestamp: new Date().toISOString()
        });
        return;
      }
      
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An unexpected error occurred',
          details: []
        },
        timestamp: new Date().toISOString()
      });
    }
  }

  async deleteRole(req: Request, res: Response): Promise<void> {
    try {
      const idParam = req.params['id'];
      if (!idParam) {
        res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Role ID is required',
            details: [
              {
                field: 'id',
                message: 'Role ID parameter is missing'
              }
            ]
          },
          timestamp: new Date().toISOString()
        });
        return;
      }

      const id = parseInt(idParam);
      
      if (!id || id <= 0) {
        res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Role ID is required',
            details: [
              {
                field: 'id',
                message: 'Role ID must be a positive integer'
              }
            ]
          },
          timestamp: new Date().toISOString()
        });
        return;
      }

      const deleted = await this.roleService.deleteRole(id);
      
      if (!deleted) {
        res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Role not found',
            details: [
              {
                field: 'id',
                message: `Role with ID ${id} does not exist`
              }
            ]
          },
          timestamp: new Date().toISOString()
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: null,
        message: `Role ${id} deactivated successfully`,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An unexpected error occurred',
          details: []
        },
        timestamp: new Date().toISOString()
      });
    }
  }
} 