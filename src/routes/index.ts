import { Router, Request, Response } from 'express';
import { userRoutes } from '../modules/users';
import { roleRoutes } from '../modules/users';
import { bedRoutes, propertyRoutes } from '../modules/properties';
import { roomRoutes } from '../modules/properties';
import { amenityRoutes } from '../modules/properties';
import { bookingRoutes } from '../modules/bookings';

const router = Router();

// Mount module routes
router.use('/users', userRoutes);
router.use('/roles', roleRoutes);
router.use('/properties', propertyRoutes);
router.use('/rooms', roomRoutes);
router.use('/amenities', amenityRoutes);
router.use('/beds', bedRoutes);
router.use('/bookings', bookingRoutes);
/**
 * @swagger
 * /api/v1:
 *   get:
 *     summary: API Information
 *     description: Get information about the API and available endpoints
 *     tags: [API]
 *     responses:
 *       200:
 *         description: API information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "API v1 is running"
 *                 endpoints:
 *                   properties:
 *                     users:
 *                       type: string
 *                       example: "/users"
 *                     roles:
 *                       type: string
 *                       example: "/roles"
 *                     health:
 *                       type: string
 *                       example: "/health"
 *                 version:
 *                   type: string
 *                   example: "1.0.0"
 */
router.get('/', (_req: Request, res: Response) => {
  res.json({
    message: 'API v1 is running',
    endpoints: {
      users: '/users',
      roles: '/roles',
      health: '/health'
    },
    version: '1.0.0'
  });
});

export default router; 