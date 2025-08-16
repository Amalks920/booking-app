# API Documentation

## 📚 Overview

This document provides comprehensive documentation for the Express TypeScript API. The API follows RESTful principles and provides endpoints for user management and system health monitoring.

**Base URL**: `http://localhost:3000`  
**API Version**: `v1`  
**Documentation**: `/api-docs` (Swagger UI)

## 🔗 Quick Links

- [Authentication](#authentication)
- [General Endpoints](#general-endpoints)
- [User Management](#user-management)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)
- [Examples](#examples)

## 🔐 Authentication

Currently, the API does not require authentication. All endpoints are publicly accessible.

**Future Implementation**: JWT-based authentication will be added for protected endpoints.

## 🌐 General Endpoints

### Welcome Endpoint

**GET** `/`

Returns welcome information and API status.

#### Response
```json
{
  "message": "Welcome to Express TypeScript API",
  "timestamp": "2025-08-15T10:30:23.837Z",
  "status": "running",
  "documentation": "/api-docs"
}
```

#### Example
```bash
curl -X GET http://localhost:3000/
```

### Health Check

**GET** `/health`

Returns the health status of the API and server information.

#### Response
```json
{
  "status": "healthy",
  "uptime": 42.123245165,
  "timestamp": "2025-08-15T10:30:23.837Z"
}
```

#### Example
```bash
curl -X GET http://localhost:3000/health
```

## 👥 User Management

### Get All Users

**GET** `/api/v1/users`

Retrieves a list of all users in the system.

#### Response
```json
{
  "message": "Get all users",
  "users": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "createdAt": "2025-08-15T10:30:23.837Z",
      "updatedAt": "2025-08-15T10:30:23.837Z"
    },
    {
      "id": 2,
      "name": "Jane Smith",
      "email": "jane@example.com",
      "createdAt": "2025-08-15T10:30:23.837Z",
      "updatedAt": "2025-08-15T10:30:23.837Z"
    }
  ]
}
```

#### Example
```bash
curl -X GET http://localhost:3000/api/v1/users
```

### Get User by ID

**GET** `/api/v1/users/{id}`

Retrieves a specific user by their unique identifier.

#### Path Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | integer | Yes | User ID |

#### Response
```json
{
  "message": "Get user with ID: 1",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2025-08-15T10:30:23.837Z",
    "updatedAt": "2025-08-15T10:30:23.837Z"
  }
}
```

#### Example
```bash
curl -X GET http://localhost:3000/api/v1/users/1
```

#### Error Responses

**400 Bad Request** - Invalid user ID
```json
{
  "error": "User ID is required"
}
```

**404 Not Found** - User not found
```json
{
  "error": "User not found"
}
```

### Create User

**POST** `/api/v1/users`

Creates a new user in the system.

#### Request Body
```json
{
  "name": "Alice Johnson",
  "email": "alice@example.com"
}
```

#### Request Schema
| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `name` | string | Yes | 2-100 characters |
| `email` | string | Yes | Valid email format, unique |

#### Response
```json
{
  "message": "User created successfully",
  "user": {
    "id": 3,
    "name": "Alice Johnson",
    "email": "alice@example.com",
    "createdAt": "2025-08-15T10:30:23.837Z",
    "updatedAt": "2025-08-15T10:30:23.837Z"
  }
}
```

#### Example
```bash
curl -X POST http://localhost:3000/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alice Johnson",
    "email": "alice@example.com"
  }'
```

#### Error Responses

**400 Bad Request** - Validation error
```json
{
  "error": "Validation error",
  "message": "Name and email are required"
}
```

**400 Bad Request** - Invalid email
```json
{
  "error": "Validation error",
  "message": "Invalid email format"
}
```

### Update User

**PUT** `/api/v1/users/{id}`

Updates an existing user's information.

#### Path Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | integer | Yes | User ID |

#### Request Body
```json
{
  "name": "John Doe Updated",
  "email": "john.updated@example.com"
}
```

**Note**: Both fields are optional. Only provided fields will be updated.

#### Response
```json
{
  "message": "User 1 updated successfully",
  "user": {
    "id": 1,
    "name": "John Doe Updated",
    "email": "john.updated@example.com",
    "createdAt": "2025-08-15T10:30:23.837Z",
    "updatedAt": "2025-08-15T10:30:23.837Z"
  }
}
```

#### Example
```bash
curl -X PUT http://localhost:3000/api/v1/users/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe Updated",
    "email": "john.updated@example.com"
  }'
```

#### Error Responses

**400 Bad Request** - Invalid user ID
```json
{
  "error": "User ID is required"
}
```

**400 Bad Request** - Validation error
```json
{
  "error": "Validation error",
  "message": "Invalid email format"
}
```

**404 Not Found** - User not found
```json
{
  "error": "User not found"
}
```

### Delete User

**DELETE** `/api/v1/users/{id}`

Removes a user from the system.

#### Path Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | integer | Yes | User ID |

#### Response
```json
{
  "message": "User 1 deleted successfully"
}
```

#### Example
```bash
curl -X DELETE http://localhost:3000/api/v1/users/1
```

#### Error Responses

**400 Bad Request** - Invalid user ID
```json
{
  "error": "User ID is required"
}
```

**404 Not Found** - User not found
```json
{
  "error": "User not found"
}
```

## 📊 API Information

**GET** `/api/v1`

Returns information about the API and available endpoints.

#### Response
```json
{
  "message": "API v1 is running",
  "endpoints": {
    "users": "/users",
    "health": "/health"
  },
  "version": "1.0.0"
}
```

#### Example
```bash
curl -X GET http://localhost:3000/api/v1
```

## 🚨 Error Handling

### Error Response Format
All error responses follow a consistent format:

```json
{
  "error": "Error type",
  "message": "Detailed error description"
}
```

### HTTP Status Codes

| Status Code | Description | Usage |
|-------------|-------------|-------|
| 200 | OK | Successful GET, PUT, DELETE operations |
| 201 | Created | Successful POST operations |
| 400 | Bad Request | Validation errors, missing parameters |
| 404 | Not Found | Resource not found |
| 500 | Internal Server Error | Server-side errors |

### Common Error Types

| Error Type | Description | Status Code |
|------------|-------------|-------------|
| `Validation error` | Input validation failed | 400 |
| `Not found` | Requested resource not found | 404 |
| `Internal server error` | Unexpected server error | 500 |

## 📈 Rate Limiting

Currently, the API does not implement rate limiting.

**Future Implementation**: Rate limiting will be added based on:
- IP address
- User authentication
- Endpoint-specific limits

## 🔒 Security

### Headers
The API includes several security headers via Helmet.js:

- `X-Content-Type-Options`: Prevents MIME type sniffing
- `X-Frame-Options`: Prevents clickjacking
- `X-XSS-Protection`: Enables XSS filtering
- `Strict-Transport-Security`: Enforces HTTPS (in production)

### CORS
Cross-Origin Resource Sharing is enabled for all origins in development.

**Production Configuration**: CORS will be restricted to specific domains.

## 📝 Data Models

### User Model
```typescript
interface User {
  id: number;           // Auto-incrementing primary key
  name: string;         // User's full name (2-100 characters)
  email: string;        // Unique email address
  createdAt: Date;      // Account creation timestamp
  updatedAt: Date;      // Last update timestamp
}
```

### Create User DTO
```typescript
interface CreateUserDto {
  name: string;         // User's full name
  email: string;        // User's email address
}
```

### Update User DTO
```typescript
interface UpdateUserDto {
  name?: string;        // Optional: User's full name
  email?: string;       // Optional: User's email address
}
```

## 🧪 Testing Examples

### Complete User CRUD Flow

#### 1. Create User
```bash
curl -X POST http://localhost:3000/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com"
  }'
```

#### 2. Get All Users
```bash
curl -X GET http://localhost:3000/api/v1/users
```

#### 3. Get Specific User
```bash
curl -X GET http://localhost:3000/api/v1/users/1
```

#### 4. Update User
```bash
curl -X PUT http://localhost:3000/api/v1/users/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Test User"
  }'
```

#### 5. Delete User
```bash
curl -X DELETE http://localhost:3000/api/v1/users/1
```

### Error Testing

#### Invalid Email Format
```bash
curl -X POST http://localhost:3000/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "invalid-email"
  }'
```

#### Missing Required Fields
```bash
curl -X POST http://localhost:3000/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User"
  }'
```

#### Non-existent User
```bash
curl -X GET http://localhost:3000/api/v1/users/999
```

## 🔮 Future Endpoints

### Planned Features

#### Authentication
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/refresh` - Refresh access token
- `POST /api/v1/auth/logout` - User logout

#### User Management
- `GET /api/v1/users/profile` - Get current user profile
- `PUT /api/v1/users/profile` - Update current user profile
- `POST /api/v1/users/{id}/avatar` - Upload user avatar
- `DELETE /api/v1/users/{id}/avatar` - Remove user avatar

#### Advanced Features
- `GET /api/v1/users?page=1&limit=10` - Paginated user list
- `GET /api/v1/users?search=john` - Search users
- `GET /api/v1/users?sort=name&order=asc` - Sorted user list

## 📚 Additional Resources

### Swagger Documentation
Interactive API documentation is available at `/api-docs` when the server is running.

### Environment Variables
```bash
PORT=3000                    # Server port
NODE_ENV=development         # Environment mode
```

### Development Tools
- **Postman**: API testing and documentation
- **Insomnia**: REST client
- **curl**: Command-line HTTP client

## 🎯 Best Practices

### Request Headers
Always include:
```bash
Content-Type: application/json
```

### Error Handling
- Check HTTP status codes
- Parse error messages for user feedback
- Implement retry logic for 5xx errors

### Data Validation
- Validate input on client side
- Handle server-side validation errors gracefully
- Provide clear error messages

## 📞 Support

For API support and questions:
- **Documentation**: `/api-docs`
- **Health Check**: `/health`
- **GitHub Issues**: Report bugs and feature requests

---

**Last Updated**: August 15, 2025  
**API Version**: 1.0.0  
**Status**: Active Development 