// modules/property/infrastructure/routes/PropertyRoutes.ts
import { Router } from 'express';
import { PropertyController } from '../../application/controllers/PropertyController';
import { PropertyService } from '../../domain/services/PropertyService';
import { PropertyRepositoryImpl } from '../repositories/PropertyRepositoryImpl';

const router = Router();

// Dependency injection
const propertyRepository = new PropertyRepositoryImpl();
const propertyService = new PropertyService(propertyRepository);
const propertyController = new PropertyController(propertyService);

/**
 * @swagger
 * /api/v1/properties:
 *   get:
 *     summary: Get all properties
 *     description: |
 *       Retrieve a paginated list of all properties in the system.
 *       This endpoint supports filtering, sorting, and pagination.
 *       
 *       **Features:**
 *       - Pagination support with customizable page size
 *       - Optional filtering by city, type, or status
 *       - Sorting by various fields (property_name, created_at, updated_at)
 *       - Search functionality for property name or description
 *       - **Note:** By default, only active properties are returned. Use status filter to include inactive properties.
 *     tags: [Properties]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: "Page number for pagination"
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: "Number of properties per page (max 100)"
 *         example: 10
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: "Search term for property name or description (partial match)"
 *         example: "Hilton"
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *         description: "Filter by city"
 *         example: "New York"
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, inactive, all]
 *           default: active
 *         description: "Filter by property status (default: active only)"
 *         example: "active"
 *       - in: query
 *         name: sort_by
 *         schema:
 *           type: string
 *           enum: [property_name, created_at, updated_at]
 *           default: created_at
 *         description: "Field to sort by"
 *         example: "property_name"
 *       - in: query
 *         name: sort_order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: "Sort order (ascending or descending)"
 *         example: "desc"
 *     responses:
 *       200:
 *         description: "List of properties retrieved successfully"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedResponse'
 *       400:
 *         description: "Bad request - Invalid query parameters"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: "Unauthorized - Authentication required"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: "Forbidden - Insufficient permissions"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: "Internal server error"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */ 
router.get('/', (req, res) => propertyController.getAllProperties(req, res));

/**
 * @swagger
 * /api/v1/properties/{id}:
 *   get:
 *     summary: Get property by ID
 *     description: "Retrieve details of a single property using its unique ID."
 *     tags: [Properties]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: "Unique ID of the property"
 *         example: 1
 *     responses:
 *       200:
 *         description: "Property retrieved successfully"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: true
 *               data:
 *                 id: 1
 *                 property_name: "Hilton Hotel"
 *                 description: "A luxury hotel in downtown"
 *                 type: "Hotel"
 *                 address: "123 Main St"
 *                 city: "New York"
 *                 state: "NY"
 *                 country: "USA"
 *                 pincode: "10001"
 *                 latitude: 40.7128
 *                 longitude: -74.0060
 *                 contact_number: "+1234567890"
 *                 status: "active"
 *                 created_by: 1
 *                 updated_by: 2
 *                 created_at: "2025-01-15T10:30:00.000Z"
 *                 updated_at: "2025-01-15T12:00:00.000Z"
 *               message: "Get property by ID"
 *               timestamp: "2025-01-15T12:30:00.000Z"
 *       400:
 *         description: "Bad request - Invalid property ID"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: "Unauthorized - Authentication required"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: "Forbidden - Insufficient permissions"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: "Property not found"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: "Internal server error"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', (req, res) => propertyController.getPropertyById(req, res));

/**
 * @swagger
 * /api/v1/properties:
 *   post:
 *     summary: Create a new property
 *     description: "Add a new property to the system."
 *     tags: [Properties]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePropertyRequest'
 *           example:
 *             property_name: "Hilton Hotel"
 *             description: "A luxury hotel in downtown"
 *             type: "Hotel"
 *             address: "123 Main St"
 *             city: "New York"
 *             state: "NY"
 *             country: "USA"
 *             pincode: "10001"
 *             latitude: 40.7128
 *             longitude: -74.0060
 *             contact_number: "+1234567890"
 *             status: "active"
 *             created_by: 1
 *             updated_by: 1
 *     responses:
 *       201:
 *         description: "Property created successfully"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: true
 *               data:
 *                 id: 1
 *                 property_name: "Hilton Hotel"
 *                 description: "A luxury hotel in downtown"
 *                 type: "Hotel"
 *                 address: "123 Main St"
 *                 city: "New York"
 *                 state: "NY"
 *                 country: "USA"
 *                 pincode: "10001"
 *                 latitude: 40.7128
 *                 longitude: -74.0060
 *                 contact_number: "+1234567890"
 *                 status: "active"
 *                 created_by: 1
 *                 updated_by: 1
 *                 created_at: "2025-01-15T10:30:00.000Z"
 *                 updated_at: "2025-01-15T12:00:00.000Z"
 *               message: "Property created successfully"
 *               timestamp: "2025-01-15T12:30:00.000Z"
 *       400:
 *         description: "Bad request - Validation error"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: "Unauthorized - Authentication required"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: "Forbidden - Insufficient permissions"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: "Internal server error"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', (req, res) => propertyController.createProperty(req, res));

/**
 * @swagger
 * /api/v1/properties/{id}:
 *   put:
 *     summary: Update an existing property
 *     description: "Update details of a property by its ID."
 *     tags: [Properties]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the property to update
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdatePropertyRequest'
 *           example:
 *             property_name: "Hilton Hotel Updated"
 *             description: "Updated description of the hotel"
 *             type: "Hotel"
 *             address: "456 Main St"
 *             city: "New York"
 *             state: "NY"
 *             country: "USA"
 *             pincode: "10002"
 *             latitude: 40.7129
 *             longitude: -74.0061
 *             contact_number: "+1234567891"
 *             status: "active"
 *             updated_by: 2
 *     responses:
 *       200:
 *         description: "Property updated successfully"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: true
 *               data:
 *                 id: 1
 *                 property_name: "Hilton Hotel Updated"
 *                 description: "Updated description of the hotel"
 *                 type: "Hotel"
 *                 address: "456 Main St"
 *                 city: "New York"
 *                 state: "NY"
 *                 country: "USA"
 *                 pincode: "10002"
 *                 latitude: 40.7129
 *                 longitude: -74.0061
 *                 contact_number: "+1234567891"
 *                 status: "active"
 *                 updated_by: 2
 *                 created_at: "2025-01-15T10:30:00.000Z"
 *                 updated_at: "2025-01-15T12:45:00.000Z"
 *               message: "Property updated successfully"
 *               timestamp: "2025-01-15T13:00:00.000Z"
 *       400:
 *         description: "Bad request - Validation error"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: "Unauthorized - Authentication required"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: "Forbidden - Insufficient permissions"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: "Property not found"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: "Internal server error"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/:id', (req, res) => propertyController.updateProperty(req, res));

/**
 * @swagger
 * /api/v1/properties/{id}:
 *   delete:
 *     summary: Delete a property
 *     description: "Delete a property by its ID."
 *     tags: [Properties]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the property to delete
 *         example: 1
 *     responses:
 *       200:
 *         description: "Property deleted successfully"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: true
 *               data: null
 *               message: "Property deleted successfully"
 *               timestamp: "2025-01-15T14:00:00.000Z"
 *       400:
 *         description: "Bad request - Invalid property ID"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: "Unauthorized - Authentication required"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: "Forbidden - Insufficient permissions"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: "Property not found"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: "Internal server error"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/:id', (req, res) => propertyController.deleteProperty(req, res));

export default router;
