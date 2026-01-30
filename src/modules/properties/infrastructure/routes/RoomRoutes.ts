import { Router } from "express";
import { RoomController } from "../../application/controllers/RoomController";
import { RoomService } from "../../domain/services/RoomService";
import { RoomRepositoryImpl } from "../repositories/RoomRepositoryImpl";
import { authenticateUser } from "../../../../shared/middleware/authMiddleware";
import { validateBody } from '../../../../shared/validation/validateBody';
import { createRoomSchema } from '../../validators/roomSchema';

const router = Router();

const roomRepository = new RoomRepositoryImpl();
const roomService = new RoomService(roomRepository);
const roomController = new RoomController(roomService);

/**
 * @swagger
 * /api/v1/rooms:
 *   get:
 *     summary: Get all rooms
 *     description: Get all rooms in the system
 *     tags: [Rooms]
 *     security:
 *       - bearerAuth: []       
 *     responses:
 *       200:
 *         description: List of rooms retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedResponse'
 *       400:
 *         description: Bad request - Invalid query parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - Insufficient permissions
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */ 
router.get('/', (req, res) => roomController.getAllRooms(req, res));

/**
 * @swagger
 * /api/v1/rooms/{id}:
 *   get:
 *     summary: Get room by ID
 *     description: |
 *       Retrieve details of a single room using its unique ID.
 *       
 *       **Features:**
 *       - Returns complete room information including property details
 *       - Includes pricing, capacity, amenities, and status information
 *       - Validates room ID format before processing
 *       
 *       **Authentication:**
 *       - This endpoint requires authentication via Bearer token (JWT)
 *       - Click the "Authorize" button at the top of the Swagger UI
 *     tags: [Rooms]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: "Unique ID of the room"
 *         example: 1
 *     responses:
 *       200:
 *         description: "Room retrieved successfully"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: true
 *               data:
 *                 id: "1"
 *                 property_id: "1"
 *                 name: "Deluxe Ocean View Suite"
 *                 type: "Suite"
 *                 description: "Spacious suite with stunning ocean views, perfect for a relaxing getaway"
 *                 capacity: 2
 *                 beds: "1 King Bed"
 *                 price_per_night: 250.00
 *                 currency: "USD"
 *                 status: "available"
 *                 floor_number: 5
 *                 size_sq_m: 45.5
 *                 view_type: "Ocean"
 *                 is_smoking_allowed: false
 *                 has_private_bathroom: true
 *                 created_by: "1"
 *                 updated_by: "1"
 *                 created_at: "2025-01-15T10:30:00.000Z"
 *                 updated_at: "2025-01-15T12:00:00.000Z"
 *               message: "Get room by ID"
 *               timestamp: "2025-01-15T12:30:00.000Z"
 *       400:
 *         description: "Bad request - Invalid room ID format or missing ID"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               error:
 *                 code: "INVALID_ROOM_ID"
 *                 message: "Invalid room ID format"
 *               timestamp: "2025-01-15T12:30:00.000Z"
 *       401:
 *         description: "Unauthorized - Authentication required"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               error:
 *                 code: "UNAUTHORIZED"
 *                 message: "Authentication required"
 *               timestamp: "2025-01-15T12:30:00.000Z"
 *       403:
 *         description: "Forbidden - Insufficient permissions"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               error:
 *                 code: "FORBIDDEN"
 *                 message: "Insufficient permissions to access this resource"
 *               timestamp: "2025-01-15T12:30:00.000Z"
 *       404:
 *         description: "Room not found"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               error:
 *                 code: "ROOM_NOT_FOUND"
 *                 message: "Room with the specified ID does not exist"
 *               timestamp: "2025-01-15T12:30:00.000Z"
 *       500:
 *         description: "Internal server error"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               error:
 *                 code: "INTERNAL_SERVER_ERROR"
 *                 message: "An unexpected error occurred while processing the request"
 *               timestamp: "2025-01-15T12:30:00.000Z"
 */
router.get('/:id', (req, res) => roomController.getRoomById(req, res));

/**
 * @swagger
 * /api/v1/rooms:
 *   post:
 *     summary: Create a new room
 *     description: Create a new room in the system
 *     tags: [Rooms]
 *     security:
 *       - bearerAuth:   []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateRoomRequest'
 *           example:
 *             name: "Room 1"
 *             description: "Room 1 description"
 *             property_id: "123e4567-e89b-12d3-a456-426614174000"
 *             size_sq_m: "100"
 *             view_type: "Ocean"
 *             room_type: "Single"
 *             room_number: "101"
 *             capacity: "1"
 *             beds: "1"
 *             price_per_night: "100"
 *             is_smoking_allowed: "true"
 *             has_private_bathroom: "true"            
 *     responses:
 *       200:
 *         description: Room created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Bad request - Invalid request body
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - Insufficient permissions
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */


router.post('/',authenticateUser, validateBody(createRoomSchema), (req, res) => roomController.createRoom(req, res));



/**
 * @swagger
 * /api/v1/rooms/{id}:
 *   put:
 *     summary: Update an existing room
 *     description: Update details of a room by its ID
 *     tags: [Rooms]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the room to update
 *         example: "1"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateRoomRequest'
 *           example:
 *             name: "Room 1 Updated"
 *             type: "Double"
 *             description: "Updated room description"
 *             capacity: 2
 *             beds: "1 Queen Bed"
 *             price_per_night: 150.00
 *             currency: "USD"
 *             status: "available"
 *             floor_number: 3
 *             size_sq_m: 25.5
 *             view_type: "Ocean"
 *             is_smoking_allowed: false
 *             has_private_bathroom: true
 *     responses:
 *       200:
 *         description: Room updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Bad request - Invalid room ID or request body
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - Insufficient permissions
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Room not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/:id',(req,res)=> roomController.updateRoom(req,res))

/**
 * @swagger
 * /api/v1/rooms/{id}:
 *   delete:
 *     summary: Delete a room
 *     description: Delete a room by its ID
 *     tags: [Rooms]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the room to delete
 *         example: "1"
 *     responses:
 *       200:
 *         description: Room deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: true
 *               data: null
 *               message: "Room deleted successfully"
 *               timestamp: "2025-01-15T14:00:00.000Z"
 *       400:
 *         description: Bad request - Invalid room ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - Insufficient permissions
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Room not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/:id',(req,res)=> roomController.deleteRoom(req,res))


export default router;