import { Router } from "express";
import { UserController,UserRepositoryImpl,UserService } from "../../../users";
import { CognitoService } from "../../domain/services/CognitoService";

const router = Router();

const userRepository = new UserRepositoryImpl();
const cognitoService = new CognitoService();
const userService = new UserService(userRepository, cognitoService);
const userController = new UserController(userService);

/**
 * @swagger
 * /api/v1/auth:
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
 *     tags: [Auth]
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
router.post('/create', (req, res) => userController.createUser(req, res));

export default router; 