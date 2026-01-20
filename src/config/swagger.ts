import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Express TypeScript API',
      version: '1.0.0',
      description: `A modern Express.js API built with TypeScript using modular monolith architecture`,
      contact: {
        name: 'API Support',
        email: 'support@example.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:4000',
        description: 'Development server'
      },
      {
        url: 'https://api.example.com',
        description: 'Production server'
      }
    ],
    components: {
      schemas: {
        User: {
          type: 'object',
          required: ['id', 'name', 'email', 'first_name', 'last_name', 'country_code', 'phone_number', 'role'],
          properties: {
            id: {
              type: 'integer',
              description: 'Unique identifier for the user'
            },
            name: {
              type: 'string',
              description: 'Full name of the user'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email address of the user'
            },
            first_name: {
              type: 'string',
              description: 'First name of the user'
            },
            last_name: {
              type: 'string',
              description: 'Last name of the user'
            },
            country_code: {
              type: 'string',
              description: 'Country code (e.g., +1, +44)'
            },
            phone_number: {
              type: 'string',
              description: 'Phone number of the user'
            },
            role: {
              type: 'string',
              format: 'uuid',
              description: 'UUID of the role assigned to the user'
            },
            status: {
              type: 'string',
              enum: ['active', 'inactive', 'suspended'],
              description: 'Current status of the user account',
              example: 'active'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp when the user was created'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp when the user was last updated'
            }
          }
        },
        Auth:{
          type: 'object',
          required: ['id', 'name', 'email', 'first_name', 'last_name', 'country_code', 'phone_number', 'role'],
          properties: {
            id: {
              type: 'integer',
              description: 'Unique identifier for the user'
            },
            name: {
              type: 'string',
              description: 'Full name of the user'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email address of the user'
            },
            first_name: {
              type: 'string',
              description: 'First name of the user'
            },
            last_name: {
              type: 'string',
              description: 'Last name of the user'
            },
            country_code: {
              type: 'string',
              description: 'Country code (e.g., +1, +44)'
            },
            phone_number: {
              type: 'string',
              description: 'Phone number of the user'
            },
            role: {
              type: 'string',
              format: 'uuid',
              description: 'UUID of the role assigned to the user'
            },
            status: {
              type: 'string',
              enum: ['active', 'inactive', 'suspended'],
              description: 'Current status of the user account',
              example: 'active'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp when the user was created'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp when the user was last updated'
            }
          }
        },
        CreateUserRequest: {
          type: 'object',
          required: ['name', 'email','password','role','first_name','last_name','country_code','phone_number'],
          properties: {
            name: {
              type: 'string',
              description: 'Full name of the user'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email address of the user'
            },
            password:{
              type:'string',
              format:'password',
              description:"password of the user"
            },
            role:{
              type:'string',
              format:'uuid',
              description:'UUID of the role assigned to the user'
            },
            first_name: {
              type: 'string',
              description: 'First name of the user'
            },
            last_name: {
              type: 'string',
              description: 'Last name of the user'
            },
            country_code: {
              type: 'string',
              description: 'Country code (e.g., +1, +44)'
            },
            phone_number: {
              type: 'string',
              description: 'Phone number of the user'
            }
          }
        },
        UpdateUserRequest: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'Full name of the user'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email address of the user'
            },
            first_name: {
              type: 'string',
              description: 'First name of the user'
            },
            last_name: {
              type: 'string',
              description: 'Last name of the user'
            },
            country_code: {
              type: 'string',
              description: 'Country code (e.g., +1, +44)'
            },
            phone_number: {
              type: 'string',
              description: 'Phone number of the user'
            },
            role: {
              type: 'string',
              format: 'uuid',
              description: 'UUID of the role assigned to the user'
            }
          }
        },
        ApiResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              description: 'Indicates if the request was successful'
            },
            data: {
              description: 'Response data'
            },
            message: {
              type: 'string',
              description: 'Response message'
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp of the response'
            }
          }
        },
        PaginatedResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              description: 'Indicates if the request was successful'
            },
            data: {
              description: 'Response data array'
            },
            pagination: {
              type: 'object',
              properties: {
                page: {
                  type: 'integer',
                  description: 'Current page number'
                },
                limit: {
                  type: 'integer',
                  description: 'Number of items per page'
                },
                total: {
                  type: 'integer',
                  description: 'Total number of items'
                },
                totalPages: {
                  type: 'integer',
                  description: 'Total number of pages'
                }
              }
            },
            message: {
              type: 'string',
              description: 'Response message'
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp of the response'
            }
          }
        },
        Role: {
          type: 'object',
          required: ['id', 'role', 'code', 'created_by', 'updated_by'],
          properties: {
            id: {
              type: 'integer',
              description: 'Unique identifier for the role'
            },
            role: {
              type: 'string',
              description: 'Human-readable role name'
            },
            code: {
              type: 'string',
              description: 'Short code/identifier for the role'
            },
            created_by: {
              type: 'integer',
              description: 'ID of the user who created this role'
            },
            updated_by: {
              type: 'integer',
              description: 'ID of the user who last updated this role'
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp when the role was created'
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp when the role was last updated'
            }
          }
        },
        CreateRoleRequest: {
          type: 'object',
          required: ['role', 'code', 'created_by', 'updated_by'],
          properties: {
            role: {
              type: 'string',
              description: 'Human-readable role name (e.g., "Administrator", "User", "Moderator")'
            },
            code: {
              type: 'string',
              description: 'Short code/identifier for the role (e.g., "ADMIN", "USER", "MOD")'
            },
            created_by: {
              type: 'integer',
              description: 'ID of the user creating this role'
            },
            updated_by: {
              type: 'integer',
              description: 'ID of the user updating this role'
            }
          }
        },
        UpdateRoleRequest: {
          type: 'object',
          properties: {
            role: {
              type: 'string',
              description: 'Human-readable role name'
            },
            code: {
              type: 'string',
              description: 'Short code/identifier for the role'
            }
          }
        },
        Property: {
          type: 'object',
          required: ['id', 'property_name', 'address', 'city', 'state', 'country', 'status', 'created_by', 'updated_by'],
          properties: {
            id: { type: 'integer', description: 'Unique identifier for the property' },
            property_name: { type: 'string', description: 'Name of the property' },
            description: { type: 'string', description: 'Property description' },
            type: { type: 'string', description: 'Type of property (e.g., hotel, apartment)' },
            address: { type: 'string', description: 'Street address of the property' },
            city: { type: 'string', description: 'City' },
            state: { type: 'string', description: 'State' },
            country: { type: 'string', description: 'Country' },
            pincode: { type: 'string', description: 'Postal code' },
            latitude: { type: 'number', format: 'float', description: 'Latitude coordinate' },
            longitude: { type: 'number', format: 'float', description: 'Longitude coordinate' },
            contact_number: { type: 'string', description: 'Contact phone number' },
            status: { type: 'string', enum: ['active', 'inactive'], description: 'Current status of the property' },
            created_by: { type: 'integer', description: 'User ID who created the property' },
            updated_by: { type: 'integer', description: 'User ID who last updated the property' },
            created_at: { type: 'string', format: 'date-time', description: 'Creation timestamp' },
            updated_at: { type: 'string', format: 'date-time', description: 'Last update timestamp' }
          }
        },
        
        CreatePropertyRequest: {
          type: 'object',
          required: ['property_name', 'address', 'city', 'state', 'country', 'created_by', 'updated_by'],
          properties: {
            property_name: { type: 'string', description: 'Name of the property' },
            description: { type: 'string', description: 'Property description' },
            type: { type: 'string', description: 'Type of property' },
            address: { type: 'string', description: 'Street address' },
            city: { type: 'string', description: 'City' },
            state: { type: 'string', description: 'State' },
            country: { type: 'string', description: 'Country' },
            pincode: { type: 'string', description: 'Postal code' },
            latitude: { type: 'number', format: 'float', description: 'Latitude coordinate' },
            longitude: { type: 'number', format: 'float', description: 'Longitude coordinate' },
            contact_number: { type: 'string', description: 'Contact number' },
            status: { type: 'string', enum: ['active', 'inactive'], description: 'Property status' },
            created_by: { type: 'integer', description: 'Creator user ID' },
            updated_by: { type: 'integer', description: 'Updater user ID' }
          }
        },
        
        UpdatePropertyRequest: {
          type: 'object',
          properties: {
            property_name: { type: 'string', description: 'Name of the property' },
            description: { type: 'string', description: 'Property description' },
            type: { type: 'string', description: 'Type of property' },
            address: { type: 'string', description: 'Street address' },
            city: { type: 'string', description: 'City' },
            state: { type: 'string', description: 'State' },
            country: { type: 'string', description: 'Country' },
            pincode: { type: 'string', description: 'Postal code' },
            latitude: { type: 'number', format: 'float', description: 'Latitude coordinate' },
            longitude: { type: 'number', format: 'float', description: 'Longitude coordinate' },
            contact_number: { type: 'string', description: 'Contact number' },
            status: { type: 'string', enum: ['active', 'inactive'], description: 'Property status' },
            updated_by: { type: 'integer', description: 'Updater user ID' }
          }
        },
        CreateRoomRequest: {
          type: 'object',
          required: ['name', 'description', 'property_id', 'type', 'capacity', 'beds', 'price_per_night', 'currency', 'is_smoking_allowed', 'has_private_bathroom', 'created_by', 'updated_by'],
          properties: {
            name: { type: 'string', description: 'Name of the room' },
            description: { type: 'string', description: 'Room description' },
            property_id: { type: 'string', description: 'ID of the property this room belongs to' },
            type: { type: 'string', description: 'Type of room (e.g., single, double, suite)' },
            capacity: { type: 'integer', description: 'Maximum number of guests the room can accommodate' },
            beds: { type: 'string', description: 'Description of beds in the room' },
            price_per_night: { type: 'number', format: 'float', description: 'Price per night for the room' },
            currency: { type: 'string', description: 'Currency code (e.g., USD, EUR)' },
            is_smoking_allowed: { type: 'boolean', description: 'Whether smoking is allowed in the room' },
            has_private_bathroom: { type: 'boolean', description: 'Whether the room has a private bathroom' },
            status: { type: 'string', enum: ['available', 'booked', 'maintenance'], description: 'Current status of the room', default: 'available' },
            created_by: { type: 'string', description: 'ID of the user creating the room' },
            updated_by: { type: 'string', description: 'ID of the user updating the room' }
          }
        },
        UpdateRoomRequest: {
          type: 'object',
          properties: {
            property_id: { type: 'string', description: 'ID of the property this room belongs to' },
            name: { type: 'string', description: 'Name of the room' },
            type: { type: 'string', description: 'Type of room (e.g., single, double, suite)' },
            description: { type: 'string', description: 'Room description' },
            capacity: { type: 'integer', description: 'Maximum number of guests the room can accommodate' },
            beds: { type: 'string', description: 'Description of beds in the room' },
            price_per_night: { type: 'number', format: 'float', description: 'Price per night for the room' },
            currency: { type: 'string', description: 'Currency code (e.g., USD, EUR)' },
            status: { type: 'string', enum: ['available', 'booked', 'maintenance'], description: 'Current status of the room' },
            floor_number: { type: 'integer', description: 'Floor number where the room is located' },
            size_sq_m: { type: 'number', format: 'float', description: 'Size of the room in square meters' },
            view_type: { type: 'string', description: 'Type of view from the room (e.g., ocean, city, garden)' },
            is_smoking_allowed: { type: 'boolean', description: 'Whether smoking is allowed in the room' },
            has_private_bathroom: { type: 'boolean', description: 'Whether the room has a private bathroom' }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              description: 'Always false for error responses'
            },
            error: {
              type: 'object',
              properties: {
                code: {
                  type: 'string',
                  description: 'Error code for programmatic handling'
                },
                message: {
                  type: 'string',
                  description: 'Human-readable error message'
                },
                details: {
                  type: 'array',
                  description: 'Detailed error information',
                  items: {
                    type: 'object',
                    properties: {
                      field: {
                        type: 'string',
                        description: 'Field name that caused the error'
                      },
                      message: {
                        type: 'string',
                        description: 'Field-specific error message'
                      }
                    }
                  }
                }
              }
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp of the error'
            }
          }
        }
      },
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    tags: [
      {
        name: 'General',
        description: 'General API endpoints'
      },
      {
        name: 'Health',
        description: 'Health check endpoints'
      },
      {
        name: 'API',
        description: 'API information endpoints'
      },
      {
        name: 'Users',
        description: 'User management endpoints'
      },
      {
        name: 'Roles',
        description: 'Role management endpoints'
      },
      {
        name: 'Properties',
        description: 'Property management endpoints'
      },
      {
        name: 'Rooms',
        description: 'Room management endpoints'
      }
    ]
  },
  apis: ['./src/modules/**/*.ts', './src/routes/*.ts', './src/index.ts']
};

export const specs = swaggerJsdoc(options); 