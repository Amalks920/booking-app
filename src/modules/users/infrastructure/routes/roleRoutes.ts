import { Router } from 'express';
import { RoleController } from '../../application/controllers/RoleController';
import { RoleService } from '../../domain/services/RoleService';
import { RoleRepositoryImpl } from '../repositories/RoleRepositoryImpl';

const router = Router();

// Dependency injection
const roleRepository = new RoleRepositoryImpl();
const roleService = new RoleService(roleRepository);
const roleController = new RoleController(roleService);

/**
 * @swagger
 * /api/v1/roles:
 *   get:
 *     summary: Get all roles
 *     description: |
 *       Retrieve a paginated list of all roles in the system.
 *       This endpoint supports filtering, sorting, and pagination.
 *       
 *       **Features:**
 *       - Pagination support with customizable page size
 *       - Optional filtering by role name, code, or creation date
 *       - Sorting by various fields (role, code, created date)
 *       - Search functionality for role name and code
 *       - **Note:** Only active roles are returned by default
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of roles per page (max 100)
 *         example: 10
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term for role name or code (partial match)
 *         example: "admin"
 *       - in: query
 *         name: code
 *         schema:
 *           type: string
 *         description: Filter by role code
 *         example: "ADMIN"
 *       - in: query
 *         name: sort_by
 *         schema:
 *           type: string
 *           enum: [role, code, created_at, updated_at]
 *           default: created_at
 *         description: Field to sort by
 *         example: "role"
 *       - in: query
 *         name: sort_order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sort order (ascending or descending)
 *         example: "desc"
 *     responses:
 *       200:
 *         description: List of roles retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedResponse'
 *             example:
 *               success: true
 *               data:
 *                 - id: 1
 *                   role: "Administrator"
 *                   code: "ADMIN"
 *                   created_by: 1
 *                   updated_by: 1
 *                   created_at: "2025-01-15T10:00:00.000Z"
 *                   updated_at: "2025-01-15T10:00:00.000Z"
 *                 - id: 2
 *                   role: "User"
 *                   code: "USER"
 *                   created_by: 1
 *                   updated_by: 1
 *                   created_at: "2025-01-15T10:00:00.000Z"
 *                   updated_at: "2025-01-15T10:00:00.000Z"
 *                 - id: 3
 *                   role: "Moderator"
 *                   code: "MOD"
 *                   created_by: 1
 *                   updated_by: 1
 *                   created_at: "2025-01-15T10:00:00.000Z"
 *                   updated_at: "2025-01-15T10:00:00.000Z"
 *               pagination:
 *                 page: 1
 *                 limit: 10
 *                 total: 3
 *                 totalPages: 1
 *               message: "Get all roles"
 *               timestamp: "2025-01-15T12:00:00.000Z"
 *       400:
 *         description: Bad request - Invalid query parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               error:
 *                 code: "VALIDATION_ERROR"
 *                 message: "Invalid query parameters"
 *                 details:
 *                   - field: "page"
 *                     message: "Page must be a positive integer"
 *                   - field: "limit"
 *                     message: "Limit must be between 1 and 100"
 *               timestamp: "2025-01-15T12:00:00.000Z"
 *       401:
 *         description: Unauthorized - Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               error:
 *                 code: "UNAUTHORIZED"
 *                 message: "Authentication token is required"
 *                 details: []
 *               timestamp: "2025-01-15T12:00:00.000Z"
 *       403:
 *         description: Forbidden - Insufficient permissions
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               error:
 *                 code: "FORBIDDEN"
 *                 message: "Insufficient permissions to access roles"
 *                 details: []
 *               timestamp: "2025-01-15T12:00:00.000Z"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               error:
 *                 code: "INTERNAL_SERVER_ERROR"
 *                 message: "An unexpected error occurred"
 *                 details: []
 *               timestamp: "2025-01-15T12:00:00.000Z"
 */
router.get('/', (req, res) => {
  roleController.getAllRoles(req, res);
});

/**
 * @swagger
 * /api/v1/roles/{id}:
 *   get:
 *     summary: Get role by ID
 *     description: |
 *       Retrieve a specific role by its unique identifier.
 *       This endpoint returns detailed role information including
 *       creation and modification details.
 *       
 *       **Note:** Only users with appropriate permissions can access role details.
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Unique identifier of the role to retrieve
 *         schema:
 *           type: integer
 *           minimum: 1
 *         example: 1
 *     responses:
 *       200:
 *         description: Role retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: true
 *               data:
 *                 id: 1
 *                 role: "Administrator"
 *                 code: "ADMIN"
 *                 created_by: 1
 *                 updated_by: 1
 *                 created_at: "2025-01-15T10:00:00.000Z"
 *                 updated_at: "2025-01-15T10:00:00.000Z"
 *               message: "Get role with ID: 1"
 *               timestamp: "2025-01-15T12:00:00.000Z"
 *       400:
 *         description: Bad request - Role ID is required or invalid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               error:
 *                 code: "VALIDATION_ERROR"
 *                 message: "Role ID is required"
 *                 details:
 *                   - field: "id"
 *                     message: "Role ID must be a positive integer"
 *               timestamp: "2025-01-15T12:00:00.000Z"
 *       401:
 *         description: Unauthorized - Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               error:
 *                 code: "UNAUTHORIZED"
 *                 message: "Authentication token is required"
 *                 details: []
 *               timestamp: "2025-01-15T12:00:00.000Z"
 *       403:
 *         description: Forbidden - Insufficient permissions to access this role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               error:
 *                 code: "FORBIDDEN"
 *                 message: "Insufficient permissions to access role details"
 *                 details: []
 *               timestamp: "2025-01-15T12:00:00.000Z"
 *       404:
 *         description: Role not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               error:
 *                 code: "NOT_FOUND"
 *                 message: "Role not found"
 *                 details:
 *                   - field: "id"
 *                     message: "Role with ID 999 does not exist"
 *               timestamp: "2025-01-15T12:00:00.000Z"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               error:
 *                 code: "INTERNAL_SERVER_ERROR"
 *                 message: "An unexpected error occurred"
 *                 details: []
 *               timestamp: "2025-01-15T12:00:00.000Z"
 */
router.get('/:id', (req, res) => {
  roleController.getRoleById(req, res);
});

/**
 * @swagger
 * /api/v1/roles:
 *   post:
 *     summary: Create a new role
 *     description: |
 *       Create a new role in the system.
 *       This endpoint handles role creation with comprehensive validation
 *       and creates a new role with the specified permissions.
 *       
 *       **Validation Rules:**
 *       - Role name must be unique and descriptive
 *       - Role code must be unique and follow naming conventions
 *       - Role code should be uppercase and alphanumeric
 *       
 *       **Security:** This endpoint requires admin privileges.
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateRoleRequest'
 *           example:
 *             role: "Content Manager"
 *             code: "CONTENT_MGR"
 *             created_by: 1
 *             updated_by: 1
 *     responses:
 *       201:
 *         description: Role created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: true
 *               data:
 *                 id: 4
 *                 role: "Content Manager"
 *                 code: "CONTENT_MGR"
 *                 created_by: 1
 *                 updated_by: 1
 *                 created_at: "2025-01-15T12:00:00.000Z"
 *                 updated_at: "2025-01-15T12:00:00.000Z"
 *               message: "Role created successfully"
 *               timestamp: "2025-01-15T12:00:00.000Z"
 *       400:
 *         description: Validation error - Request data is invalid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               error:
 *                 code: "VALIDATION_ERROR"
 *                 message: "Validation failed"
 *                 details:
 *                   - field: "role"
 *                     message: "Role name is required"
 *                   - field: "code"
 *                     message: "Role code must be uppercase and alphanumeric"
 *                   - field: "created_by"
 *                     message: "Created by is required"
 *                   - field: "updated_by"
 *                     message: "Updated by is required"
 *               timestamp: "2025-01-15T12:00:00.000Z"
 *       401:
 *         description: Unauthorized - Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               error:
 *                 code: "UNAUTHORIZED"
 *                 message: "Authentication token is required"
 *                 details: []
 *               timestamp: "2025-01-15T12:00:00.000Z"
 *       403:
 *         description: Forbidden - Insufficient permissions to create roles
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               error:
 *                 code: "FORBIDDEN"
 *                 message: "Insufficient permissions to create roles"
 *                 details: []
 *               timestamp: "2025-01-15T12:00:00.000Z"
 *       409:
 *         description: Conflict - Role already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               error:
 *                 code: "CONFLICT"
 *                 message: "Role already exists"
 *                 details:
 *                   - field: "code"
 *                     message: "Role code ADMIN is already registered"
 *               timestamp: "2025-01-15T12:00:00.000Z"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               error:
 *                 code: "INTERNAL_SERVER_ERROR"
 *                 message: "An unexpected error occurred"
 *                 details: []
 *               timestamp: "2025-01-15T12:00:00.000Z"
 */
router.post('/', (req, res) => {
  roleController.createRole(req, res);
});

/**
 * @swagger
 * /api/v1/roles/{id}:
 *   put:
 *     summary: Update role
 *     description: |
 *       Update an existing role's information.
 *       This endpoint allows partial updates of role data, including
 *       role name and code modifications.
 *       
 *       **Update Rules:**
 *       - Only specified fields will be updated
 *       - Role name and code changes require uniqueness validation
 *       - Some system roles may be restricted from modification
 *       
 *       **Security:** Only admins can update roles.
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Unique identifier of the role to update
 *         schema:
 *           type: integer
 *           minimum: 1
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateRoleRequest'
 *           example:
 *             role: "Senior Administrator"
 *             code: "SENIOR_ADMIN"
 *     responses:
 *       200:
 *         description: Role updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: true
 *               data:
 *                 id: 1
 *                 role: "Senior Administrator"
 *                 code: "SENIOR_ADMIN"
 *                 created_by: 1
 *                 updated_by: 1
 *                 created_at: "2025-01-15T10:00:00.000Z"
 *                 updated_at: "2025-01-15T12:00:00.000Z"
 *               message: "Role 1 updated successfully"
 *               timestamp: "2025-01-15T12:00:00.000Z"
 *       400:
 *         description: Bad request - Validation error or invalid data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               error:
 *                 code: "VALIDATION_ERROR"
 *                 message: "Validation failed"
 *                 details:
 *                   - field: "code"
 *                     message: "Role code must be uppercase and alphanumeric"
 *               timestamp: "2025-01-15T12:00:00.000Z"
 *       401:
 *         description: Unauthorized - Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               error:
 *                 code: "UNAUTHORIZED"
 *                 message: "Authentication token is required"
 *                 details: []
 *               timestamp: "2025-01-15T12:00:00.000Z"
 *       403:
 *         description: Forbidden - Insufficient permissions to update this role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               error:
 *                 code: "FORBIDDEN"
 *                 message: "Insufficient permissions to update roles"
 *                 details: []
 *               timestamp: "2025-01-15T12:00:00.000Z"
 *       404:
 *         description: Role not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               error:
 *                 code: "NOT_FOUND"
 *                 message: "Role not found"
 *                 details:
 *                   - field: "id"
 *                     message: "Role with ID 999 does not exist"
 *               timestamp: "2025-01-15T12:00:00.000Z"
 *       409:
 *         description: Conflict - Role code already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               error:
 *                 code: "CONFLICT"
 *                 message: "Role code already exists"
 *                 details:
 *                   - field: "code"
 *                     message: "Role code SENIOR_ADMIN is already registered by another role"
 *               timestamp: "2025-01-15T12:00:00.000Z"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               error:
 *                 code: "INTERNAL_SERVER_ERROR"
 *                 message: "An unexpected error occurred"
 *                 details: []
 *               timestamp: "2025-01-15T12:00:00.000Z"
 */
router.put('/:id', (req, res) => {
  roleController.updateRole(req, res);
});

/**
 * @swagger
 * /api/v1/roles/{id}:
 *   delete:
 *     summary: Soft delete role (deactivate)
 *     description: |
 *       Deactivate a role in the system.
 *       This operation performs a soft delete, marking the role as inactive
 *       while preserving all data for audit and recovery purposes.
 *       
 *       **Soft Delete Behavior:**
 *       - Role is marked as inactive/deleted
 *       - All role data is preserved in the database
 *       - Role cannot be assigned to new users
 *       - Existing users with this role may be affected
 *       - Data can be restored if needed
 *       
 *       **Important Notes:**
 *       - System roles (ADMIN, USER) cannot be deleted
 *       - Check for active users before deactivation
 *       
 *       **Security:** Only admins can deactivate roles.
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Unique identifier of the role to deactivate
 *         schema:
 *           type: integer
 *           minimum: 1
 *         example: 1
 *     responses:
 *       200:
 *         description: Role deactivated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: true
 *               data: null
 *               message: "Role 1 deactivated successfully"
 *               timestamp: "2025-01-15T12:00:00.000Z"
 *       400:
 *         description: Bad request - Role ID is required or invalid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               error:
 *                 code: "VALIDATION_ERROR"
 *                 message: "Role ID is required"
 *                 details:
 *                   - field: "id"
 *                     message: "Role ID must be a positive integer"
 *               timestamp: "2025-01-15T12:00:00.000Z"
 *       401:
 *         description: Unauthorized - Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               error:
 *                 code: "UNAUTHORIZED"
 *                 message: "Authentication token is required"
 *                 details: []
 *               timestamp: "2025-01-15T12:00:00.000Z"
 *       403:
 *         description: Forbidden - Insufficient permissions to deactivate this role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               error:
 *                 code: "FORBIDDEN"
 *                 message: "Only administrators can deactivate roles"
 *                 details: []
 *               timestamp: "2025-01-15T12:00:00.000Z"
 *       404:
 *         description: Role not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               error:
 *                 code: "NOT_FOUND"
 *                 message: "Role not found"
 *                 details:
 *                   - field: "id"
 *                     message: "Role with ID 999 does not exist"
 *               timestamp: "2025-01-15T12:00:00.000Z"
 *       409:
 *         description: Conflict - Role cannot be deactivated due to active dependencies
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               error:
 *                 code: "CONFLICT"
 *                 message: "Role cannot be deactivated"
 *                 details:
 *                   - field: "id"
 *                     message: "Role has active users assigned and cannot be deactivated"
 *               timestamp: "2025-01-15T12:00:00.000Z"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               error:
 *                 code: "INTERNAL_SERVER_ERROR"
 *                 message: "An unexpected error occurred"
 *                 details: []
 *               timestamp: "2025-01-15T12:00:00.000Z"
 */
router.delete('/:id', (req, res) => {
  roleController.deleteRole(req, res);
});

export default router; 