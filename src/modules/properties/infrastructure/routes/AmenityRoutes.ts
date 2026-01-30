import { Router } from 'express';
import { AmenityController } from '../../application/controllers/AmenityController';
import { AmenityService } from '../../domain/services/AmenityService';
import { AmenityRepositoryImpl } from '../repositories/AmenityRepositoryImpl';
import { authenticateUser } from '../../../../shared/middleware/authMiddleware';
import { validateBody } from '../../../../shared/validation/validateBody';
import { createAmenitySchema } from '../../validators/amenitySchema';

const router = Router();

// Dependency injection
const amenityRepository = new AmenityRepositoryImpl();
const amenityService = new AmenityService(amenityRepository);
const amenityController = new AmenityController(amenityService);

/**
 * @swagger
 * tags:
 *   name: Amenities
 *   description: API for managing amenities
 */

/**
 * @swagger
 * /api/v1/amenities:
 *   post:
 *     summary: Create a new amenity
 *     tags: [Amenities]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateAmenityRequest'
 *     responses:
 *       201:
 *         description: Amenity created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.post('/', authenticateUser, validateBody(createAmenitySchema), (req, res) => amenityController.createAmenity(req, res));

/**
 * @swagger
 * /api/v1/amenities:
 *   get:
 *     summary: Get all amenities
 *     tags: [Amenities]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of amenities retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Amenity'
 */
router.get('/', authenticateUser, (req, res) => amenityController.getAllAmenities(req, res));

/**
 * @swagger
 * /api/v1/amenities/{id}:
 *   get:
 *     summary: Get amenity by ID
 *     tags: [Amenities]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Amenity ID
 *     responses:
 *       200:
 *         description: Amenity retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Amenity'
 */
router.get('/:id', authenticateUser, (req, res) => amenityController.getAmenityById(req, res));

/**
 * @swagger
 * /api/v1/amenities/{id}:
 *   put:
 *     summary: Update an amenity by ID
 *     tags: [Amenities]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Amenity ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateAmenityRequest'
 *     responses:
 *       200:
 *         description: Amenity updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.put('/:id', authenticateUser, validateBody(createAmenitySchema), (req, res) => amenityController.updateAmenity(req, res));

/**
 * @swagger
 * /api/v1/amenities/{id}:
 *   delete:
 *     summary: Delete an amenity by ID
 *     tags: [Amenities]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Amenity ID
 *     responses:
 *       200:
 *         description: Amenity deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.delete('/:id', authenticateUser, (req, res) => amenityController.deleteAmenity(req, res));

export default router;

