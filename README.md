# Express TypeScript App Boilerplate

A modern, production-ready Express.js application built with TypeScript, featuring security middleware, logging, and a clean project structure.

## Features

- 🚀 **Express.js** - Fast, unopinionated web framework
- 🔒 **TypeScript** - Type-safe JavaScript development
- 🛡️ **Security** - Helmet.js for security headers
- 🌐 **CORS** - Cross-origin resource sharing support
- 📝 **Logging** - Morgan HTTP request logger
- 🔧 **Development** - Hot reload with ts-node-dev
- 📦 **Build System** - TypeScript compilation
- 🧹 **Linting** - ESLint with TypeScript support

## Project Structure

```
├── src/
│   ├── routes/
│   │   ├── index.ts          # Main router
│   │   └── userRoutes.ts     # User routes example
│   └── index.ts              # Application entry point
├── dist/                     # Compiled JavaScript (generated)
├── package.json              # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
├── .eslintrc.js             # ESLint configuration
├── env.example              # Environment variables template
└── README.md                # This file
```

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Setup

Copy the environment template and configure your variables:

```bash
cp env.example .env
```

Edit `.env` file with your configuration.

### 3. Development

Start the development server with hot reload:

```bash
npm run dev
```

The server will start on `http://localhost:3000`

### 4. Production Build

Build the application for production:

```bash
npm run build
npm start
```

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run clean` - Remove build artifacts
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues automatically

## API Endpoints

### Base Routes
- `GET /` - Welcome message
- `GET /health` - Health check

### API Routes
- `GET /api/v1/` - API information
- `GET /api/v1/users` - Get all users
- `GET /api/v1/users/:id` - Get user by ID
- `POST /api/v1/users` - Create new user
- `PUT /api/v1/users/:id` - Update user
- `DELETE /api/v1/users/:id` - Delete user

## Development

### Adding New Routes

1. Create a new route file in `src/routes/`
2. Import and mount it in `src/routes/index.ts`

Example:

```typescript
// src/routes/productRoutes.ts
import { Router, Request, Response } from 'express';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Products route' });
});

export default router;
```

Then mount it in `src/routes/index.ts`:

```typescript
import productRoutes from './productRoutes';
// ... existing code ...
router.use('/products', productRoutes);
```

### Middleware

The application includes several built-in middleware:

- **Helmet** - Security headers
- **CORS** - Cross-origin requests
- **Morgan** - HTTP request logging
- **JSON Parser** - Parse JSON request bodies
- **URL Encoded Parser** - Parse URL-encoded bodies

### Error Handling

Global error handling is implemented in `src/index.ts` with:

- 404 handler for unmatched routes
- Global error handler for uncaught exceptions
- Environment-aware error messages

## Production Considerations

- Set `NODE_ENV=production` in your environment
- Use a process manager like PM2
- Implement proper logging
- Set up monitoring and health checks
- Configure reverse proxy (nginx)
- Use HTTPS in production

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

MIT License - see LICENSE file for details 