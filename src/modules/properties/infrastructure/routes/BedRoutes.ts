import { Router } from "express";
import { BedController } from "../../application/controllers/BedController";
import { BedService } from "../../domain/services/BedService";
import { BedRepositoryImpl } from "../repositories/BedRepositoryImpl";
import { authenticateUser } from "../../../../shared/middleware/authMiddleware";
import { validateBody } from '../../../../shared/validation/validateBody';
import { createBedSchema, updateBedSchema } from '../../validators/bedSchema';

const router = Router();

const bedRepository = new BedRepositoryImpl();
const bedService = new BedService(bedRepository);
const bedController = new BedController(bedService);

/**
 * @swagger
 * /api/v1/beds:
 *   get:
 *     summary: Get all beds
 *     description: Get all beds in the system
 *     tags: [Beds]
 *     security:
 *       - bearerAuth: []       
 *     responses:
 *       200:
 *         description: List of beds retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', authenticateUser, (req, res) => bedController.getAllBeds(req, res));

/**
 * @swagger
 * /api/v1/beds/{id}:
 *   get:
 *     summary: Get bed by ID
 *     description: Retrieve details of a single bed using its unique ID.
 *     tags: [Beds]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: "Unique ID of the bed"
 *     responses:
 *       200:
 *         description: "Bed retrieved successfully"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: "Bad request - Invalid bed ID format"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: "Bed not found"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', authenticateUser, (req, res) => bedController.getBedById(req, res));

/**
 * @swagger
 * /api/v1/beds/room/{roomId}:
 *   get:
 *     summary: Get beds by Room ID
 *     description: Retrieve all beds for a specific room.
 *     tags: [Beds]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: roomId
 *         required: true
 *         schema:
 *           type: string
 *         description: "Unique ID of the room"
 *     responses:
 *       200:
 *         description: "Beds retrieved successfully"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.get('/room/:roomId', authenticateUser, (req, res) => bedController.getBedsByRoomId(req, res));

/**
 * @swagger
 * /api/v1/beds:
 *   post:
 *     summary: Create a new bed
 *     description: Create a new bed definition for a room
 *     tags: [Beds]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateBedRequest'
 *           example:
 *             room_id: "123e4567-e89b-12d3-a456-426614174000"
 *             bed_type: "King"
 *             quantity: 1
 *     responses:
 *       200:
 *         description: Bed created successfully
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
 */
router.post('/', authenticateUser, validateBody(createBedSchema), (req, res) => bedController.createBed(req, res));

/**
 * @swagger
 * /api/v1/beds/{id}:
 *   put:
 *     summary: Update an existing bed
 *     description: Update details of a bed by its ID
 *     tags: [Beds]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the bed to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateBedRequest'
 *           example:
 *             bed_type: "Queen"
 *             quantity: 2
 *     responses:
 *       200:
 *         description: Bed updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Bad request - Invalid bed ID or request body
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Bed not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/:id', authenticateUser, validateBody(updateBedSchema), (req, res) => bedController.updateBed(req, res));

/**
 * @swagger
 * /api/v1/beds/{id}:
 *   delete:
 *     summary: Delete a bed
 *     description: Delete a bed by its ID
 *     tags: [Beds]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the bed to delete
 *     responses:
 *       200:
 *         description: Bed deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Bad request - Invalid bed ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Bed not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/:id', authenticateUser, (req, res) => bedController.deleteBed(req, res));

export default router;
