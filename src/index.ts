import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import routes from './routes';
import { specs } from './config/swagger';
import { errorHandler } from './shared/middleware/errorHandler';
import sequelize from './config/database'; // Import your Sequelize instance

// Load environment variables
dotenv.config();

// Create Express app
const app: Application = express();
const PORT = process.env['PORT'] || 3000;

// Database connection function
async function initializeDatabase(): Promise<boolean> {
  try {
    console.log('🔄 Connecting to database...');
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully');
    
    // Sync database models (be careful in production)
    if (process.env['NODE_ENV'] === 'development') {
      await sequelize.sync({ alter: true });
      console.log('✅ Database models synchronized');
    } else {
      // In production, just check if we can connect
      await sequelize.sync({ alter: false });
      console.log('✅ Database models verified');
    }
    
    return true;
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
    return false;
  }
}

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(morgan('combined')); // Logging
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Express TypeScript API Documentation'
}));

/**
 * @swagger
 * /:
 *   get:
 *     summary: Welcome
 *     description: Welcome message and API information
 *     tags: [General]
 *     responses:
 *       200:
 *         description: Welcome message retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Welcome to Express TypeScript API"
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 status:
 *                   type: string
 *                   example: "running"
 *                 documentation:
 *                   type: string
 *                   example: "/api-docs"
 */
app.get('/', (_req: Request, res: Response) => {
  res.json({
    message: 'Welcome to Express TypeScript API',
    timestamp: new Date().toISOString(),
    status: 'running',
    documentation: '/api-docs'
  });
});

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health Check
 *     description: Check the health status of the API
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Health status retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "healthy"
 *                 uptime:
 *                   type: number
 *                   description: "Server uptime in seconds"
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 database:
 *                   type: string
 *                   example: "connected"
 */
app.get('/health', async (_req: Request, res: Response) => {
  let dbStatus = 'disconnected';
  
  try {
    await sequelize.authenticate();
    dbStatus = 'connected';
  } catch (error) {
    dbStatus = 'disconnected';
  }
  
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    database: dbStatus
  });
});

// API routes
app.use('/api/v1', routes);

// 404 handler
app.use('*', (req: Request, res: Response) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl
  });
});

// Global error handler
app.use(errorHandler);

// Application startup function
async function startApplication(): Promise<void> {
  try {
    // Initialize database connection
    const dbConnected = await initializeDatabase();
    
    if (!dbConnected) {
      console.error('❌ Failed to connect to database. Exiting...');
      process.exit(1);
    }
    
    // Start the server
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`📱 Environment: ${process.env['NODE_ENV'] || 'development'}`);
      console.log(`🔗 Health check: http://localhost:${PORT}/health`);
      console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
    });
    
  } catch (error) {
    console.error('❌ Failed to start application:', error);
    process.exit(1);
  }
}

// Graceful shutdown handler
process.on('SIGINT', async () => {
  console.log('\n🔄 Shutting down gracefully...');
  
  try {
    await sequelize.close();
    console.log('✅ Database connection closed');
  } catch (error) {
    console.error('❌ Error closing database connection:', error);
  }
  
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🔄 Received SIGTERM, shutting down gracefully...');
  
  try {
    await sequelize.close();
    console.log('✅ Database connection closed');
  } catch (error) {
    console.error('❌ Error closing database connection:', error);
  }
  
  process.exit(0);
});

// Start the application
startApplication();

export default app;