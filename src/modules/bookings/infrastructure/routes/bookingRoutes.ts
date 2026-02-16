import { Router } from "express";
import { BookingController } from "../../application/controllers/BookingController";
import { BookingService } from "../../domain/services/BookingService";
import { BookingRepositoryImpl } from "../../infrastructure/repositories/BookingRepository";
import { authenticateUser } from "../../../../shared/middleware/authMiddleware";
import { validateBody } from "../../../../shared/validation/validateBody";
import { createOrderInput } from "../../application/validation/bookingSchemas";

const router = Router();

const bookingRepository = new BookingRepositoryImpl();
const bookingService = new BookingService(bookingRepository);
const bookingController = new BookingController(bookingService);

/**
 * @swagger
 * /api/v1/bookings:
 *   post:
 *     summary: Create a new booking
 *     description: Create a new booking in the system
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth:   []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateBookingRequest'
 *     responses:
 *       201:
 *         description: Booking created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Bad request - Invalid request body
 *       401:
 *         description: Unauthorized - Authentication required
 */
router.post('/', authenticateUser, (req, res) => bookingController.createBooking(req, res));

/**
 * @swagger
 * /api/v1/bookings/create-order:
 *   post:
 *     summary: Create an order
 *     description: Create a payment order
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Order created successfully
 *       501:
 *         description: Not implemented
 */
router.post('/create-order', authenticateUser, validateBody(createOrderInput), (_req, res) => {
    res.status(501).json({ message: 'Not implemented' });
});


/**
 * @swagger
 * /api/v1/bookings/{id}:
 *   get:
 *     summary: Get booking by ID
 *     description: Retrieve details of a single booking using its unique ID
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique ID of the booking
 *     responses:
 *       200:
 *         description: Booking retrieved successfully
 *       404:
 *         description: Booking not found
 */
router.get('/:id', authenticateUser, (req, res) => bookingController.getBookingById(req, res));

export default router;
