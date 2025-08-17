import { Router } from 'express';
import { UserController } from '../../application/controllers/UserController';
import { UserService } from '../../domain/services/UserService';
import { UserRepositoryImpl } from '../repositories/UserRepositoryImpl';

const router = Router();

// Dependency injection
const userRepository = new UserRepositoryImpl();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

/**
 * @swagger
 * /api/v1/users:
 *   get:
 *     summary: Get all users
 *     description: |
 *       Retrieve a paginated list of all users in the system.
 *       This endpoint supports filtering, sorting, and pagination.
 *       
 *       **Features:**
 *       - Pagination support with customizable page size
 *       - Optional filtering by role, country, or creation date
 *       - Sorting by various fields (name, email, created date)
 *       - Search functionality for name and email
 *       - **Note:** By default, only active users are returned. Use status filter to include inactive users.
 *     tags: [Users]
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
 *         description: Number of users per page (max 100)
 *         example: 10
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term for name or email (partial match)
 *         example: "amal"
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter by role UUID
 *         example: "3dskjf48-4389-89ir-i949-123456789abc"
 *       - in: query
 *         name: country_code
 *         schema:
 *           type: string
 *         description: Filter by country code
 *         example: "+1"
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, inactive, suspended, all]
 *           default: active
 *         description: Filter by user status (default: active users only)
 *         example: "active"
 *       - in: query
 *         name: sort_by
 *         schema:
 *           type: string
 *           enum: [name, email, created_at, updated_at]
 *           default: created_at
 *         description: Field to sort by
 *         example: "name"
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
 *         description: List of users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedResponse'
 *             example:
 *               success: true
 *               data:
 *                 - id: 1
 *                   name: "Amal KS"
 *                   email: "amal@example.com"
 *                   first_name: "Amal"
 *                   last_name: "KS"
 *                   country_code: "+1"
 *                   phone_number: "5551234567"
 *                   role: "3dskjf48-4389-89ir-i949-123456789abc"
 *                   status: "active"
 *                   createdAt: "2025-01-15T10:30:00.000Z"
 *                   updatedAt: "2025-01-15T10:30:00.000Z"
 *                 - id: 2
 *                   name: "John Doe"
 *                   email: "john@example.com"
 *                   first_name: "John"
 *                   last_name: "Doe"
 *                   country_code: "+44"
 *                   phone_number: "2071234567"
 *                   role: "3dskjf48-4389-89ir-i949-123456789abc"
 *                   status: "active"
 *                   createdAt: "2025-01-15T11:00:00.000Z"
 *                   updatedAt: "2025-01-15T11:00:00.000Z"
 *               pagination:
 *                 page: 1
 *                 limit: 10
 *                 total: 2
 *                 totalPages: 1
 *               message: "Get all users"
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
 *                 message: "Insufficient permissions to access users"
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

router.get('/', (req, res) => userController.getAllUsers(req, res));

/**
 * @swagger
 * /api/v1/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     description: |
 *       Retrieve a specific user by their unique identifier.
 *       This endpoint returns detailed user information including personal details,
 *       contact information, and role assignment.
 *       
 *       **Note:** Users can only access their own profile unless they have admin privileges.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Unique identifier of the user to retrieve
 *         schema:
 *           type: integer
 *           minimum: 1
 *         example: 1
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: true
 *               data:
 *                 id: 1
 *                 name: "Amal KS"
 *                 email: "amal@example.com"
 *                 first_name: "Amal"
 *                 last_name: "KS"
 *                 country_code: "+1"
 *                 phone_number: "5551234567"
 *                 role: "3dskjf48-4389-89ir-i949-123456789abc"
 *                 status: "active"
 *                 createdAt: "2025-01-15T10:30:00.000Z"
 *                 updatedAt: "2025-01-15T10:30:00.000Z"
 *               message: "Get user with ID: 1"
 *               timestamp: "2025-01-15T12:00:00.000Z"
 *       400:
 *         description: Bad request - User ID is required or invalid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               error:
 *                 code: "VALIDATION_ERROR"
 *                 message: "User ID is required"
 *                 details:
 *                   - field: "id"
 *                     message: "User ID must be a positive integer"
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
 *         description: Forbidden - Insufficient permissions to access this user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               error:
 *                 code: "FORBIDDEN"
 *                 message: "You can only access your own profile"
 *                 details: []
 *               timestamp: "2025-01-15T12:00:00.000Z"
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               error:
 *                 code: "NOT_FOUND"
 *                 message: "User not found"
 *                 details:
 *                   - field: "id"
 *                     message: "User with ID 999 does not exist"
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
router.get('/:id', (req, res) => userController.getUserById(req, res));
//'name', 'email','password','role_id','first_name','last_name','country_code','phone_number'
/**
 * @swagger
 * /api/v1/users:
 *   post:
 *     summary: Create a new user
 *     description: |
 *       Create a new user account in the system.
 *       This endpoint handles user registration with comprehensive validation
 *       and creates a new user profile with the specified role and permissions.
 *       
 *       **Validation Rules:**
 *       - Email must be unique and valid format
 *       - Password must meet security requirements
 *       - Phone number must be valid for the specified country
 *       - Role must exist in the system
 *       
 *       **Security:** This endpoint may require admin privileges depending on configuration.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUserRequest'
 *           example:
 *             name: "Amal KS"
 *             email: "amal@example.com"
 *             password: "Amal@123"
 *             role: "3dskjf48-4389-89ir-i949-123456789abc"
 *             first_name: "Amal"
 *             last_name: "KS"
 *             country_code: "+1"
 *             phone_number: "5551234567"
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: true
 *               data:
 *                 id: 1
 *                 name: "Amal KS"
 *                 email: "amal@example.com"
 *                 first_name: "Amal"
 *                 last_name: "KS"
 *                 country_code: "+1"
 *                 phone_number: "5551234567"
 *                 role: "3dskjf48-4389-89ir-i949-123456789abc"
 *                 status: "active"
 *                 createdAt: "2025-01-15T12:00:00.000Z"
 *                 updatedAt: "2025-01-15T12:00:00.000Z"
 *               message: "User created successfully"
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
 *                   - field: "email"
 *                     message: "Email is required"
 *                   - field: "password"
 *                     message: "Password must be at least 8 characters with uppercase, lowercase, number, and special character"
 *                   - field: "phone_number"
 *                     message: "Phone number is invalid for country code +1"
 *                   - field: "role"
 *                     message: "Role UUID is invalid or does not exist"
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
 *         description: Forbidden - Insufficient permissions to create users
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               error:
 *                 code: "FORBIDDEN"
 *                 message: "Insufficient permissions to create users"
 *                 details: []
 *               timestamp: "2025-01-15T12:00:00.000Z"
 *       409:
 *         description: Conflict - User already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               error:
 *                 code: "CONFLICT"
 *                 message: "User already exists"
 *                 details:
 *                   - field: "email"
 *                     message: "Email address is already registered"
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
router.post('/', (req, res) => userController.createUser(req, res));

/**
 * @swagger
 * /api/v1/users/{id}:
 *   put:
 *     summary: Update user
 *     description: |
 *       Update an existing user's information.
 *       This endpoint allows partial updates of user data, including personal details,
 *       contact information, and role assignment.
 *       
 *       **Update Rules:**
 *       - Only specified fields will be updated
 *       - Email changes require uniqueness validation
 *       - Role changes require proper permissions
 *       - Some fields may be restricted based on user role
 *       
 *       **Security:** Users can only update their own profile unless they have admin privileges.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Unique identifier of the user to update
 *         schema:
 *           type: integer
 *           minimum: 1
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserRequest'
 *           example:
 *             name: "Amal KS Updated"
 *             email: "amal.updated@example.com"
 *             first_name: "Amal"
 *             last_name: "KS Updated"
 *             country_code: "+1"
 *             phone_number: "5559876543"
 *             role: "3dskjf48-4389-89ir-i949-123456789abc"
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: true
 *               data:
 *                 id: 1
 *                 name: "Amal KS Updated"
 *                 email: "amal.updated@example.com"
 *                 first_name: "Amal"
 *                 last_name: "KS"
 *                 country_code: "+1"
 *                 phone_number: "5551234567"
 *                 role: "3dskjf48-4389-89ir-i949-123456789abc"
 *                 status: "active"
 *                 createdAt: "2025-01-15T10:30:00.000Z"
 *                 updatedAt: "2025-01-15T11:45:00.000Z"
 *               message: "User 1 updated successfully"
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
 *                   - field: "email"
 *                     message: "Invalid email format"
 *                   - field: "phone_number"
 *                     message: "Phone number is invalid for country code +1"
 *                   - field: "role"
 *                     message: "Role UUID is invalid or does not exist"
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
 *         description: Forbidden - Insufficient permissions to update this user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               error:
 *                 code: "FORBIDDEN"
 *                 message: "You can only update your own profile"
 *                 details: []
 *               timestamp: "2025-01-15T12:00:00.000Z"
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               error:
 *                 code: "NOT_FOUND"
 *                 message: "User not found"
 *                 details:
 *                   - field: "id"
 *                     message: "User with ID 999 does not exist"
 *               timestamp: "2025-01-15T12:00:00.000Z"
 *       409:
 *         description: Conflict - Email already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               error:
 *                 code: "CONFLICT"
 *                 message: "Email already exists"
 *                 details:
 *                   - field: "email"
 *                     message: "Email address is already registered by another user"
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
router.put('/:id', (req, res) => userController.updateUser(req, res));

/**
 * @swagger
 * /api/v1/users/{id}:
 *   delete:
 *     summary: Soft delete user (deactivate)
 *     description: |
 *       Deactivate a user account in the system.
 *       This operation performs a soft delete, marking the user as inactive
 *       while preserving all data for audit and recovery purposes.
 *       
 *       **Soft Delete Behavior:**
 *       - User account is marked as inactive/deleted
 *       - All user data is preserved in the database
 *       - User cannot log in or access the system
 *       - Data can be restored if needed
 *       - Associated records remain intact
 *       
 *       **Security:** Only admins can deactivate users, or users can deactivate their own account.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Unique identifier of the user to deactivate
 *         schema:
 *           type: integer
 *           minimum: 1
 *         example: 1
 *     responses:
 *       200:
 *         description: User deactivated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: true
 *               data: null
 *               message: "User 1 deactivated successfully"
 *               timestamp: "2025-01-15T12:00:00.000Z"
 *       400:
 *         description: Bad request - User ID is required or invalid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               error:
 *                 code: "VALIDATION_ERROR"
 *                 message: "User ID is required"
 *                 details:
 *                   - field: "id"
 *                     message: "User ID must be a positive integer"
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
 *         description: Forbidden - Insufficient permissions to deactivate this user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               error:
 *                 code: "FORBIDDEN"
 *                 message: "You can only deactivate your own account or must have admin privileges"
 *                 details: []
 *               timestamp: "2025-01-15T12:00:00.000Z"
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               error:
 *                 code: "NOT_FOUND"
 *                 message: "User not found"
 *                 details:
 *                   - field: "id"
 *                     message: "User with ID 999 does not exist"
 *               timestamp: "2025-01-15T12:00:00.000Z"
 *       409:
 *         description: Conflict - User cannot be deactivated due to active dependencies
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               error:
 *                 code: "CONFLICT"
 *                 message: "User cannot be deactivated"
 *                 details:
 *                   - field: "id"
 *                     message: "User has active bookings or other dependencies that must be resolved first"
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
router.delete('/:id', (req, res) => userController.deleteUser(req, res));

export default router; 








