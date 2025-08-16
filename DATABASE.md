# Database Setup Guide

This application uses **PostgreSQL** as the primary database with **Sequelize ORM** for data access.

## 🗄️ Database Architecture

### Clean Architecture Integration
- **Domain Layer**: Pure business entities (no database dependencies)
- **Infrastructure Layer**: Sequelize models and repositories
- **Repository Pattern**: Abstracts data access behind interfaces

### Database Structure
```
src/config/
├── database.ts              # Sequelize configuration
├── databaseInit.ts          # Database initialization
├── migrations/              # SQL migration files
│   └── 001-create-users-table.sql
└── seeders/                 # SQL seeder files
    └── 001-seed-users.sql
```

## 🚀 Quick Setup

### 1. Install PostgreSQL
```bash
# Ubuntu/Debian
sudo apt-get install postgresql postgresql-contrib

# macOS with Homebrew
brew install postgresql

# Windows
# Download from https://www.postgresql.org/download/windows/
```

### 2. Create Database
```bash
# Connect to PostgreSQL
sudo -u postgres psql

# Create database
CREATE DATABASE booking_app;

# Create user (optional)
CREATE USER booking_user WITH PASSWORD 'your_password';

# Grant privileges
GRANT ALL PRIVILEGES ON DATABASE booking_app TO booking_user;

# Exit
\q
```

### 3. Configure Environment
```bash
# Copy environment template
cp env.example .env

# Edit .env file with your database credentials
DB_HOST=localhost
DB_PORT=5432
DB_NAME=booking_app
DB_USER=postgres
DB_PASSWORD=your_password_here
```

### 4. Run the Application
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The application will automatically:
- Connect to PostgreSQL
- Create tables if they don't exist
- Sync models with the database

## 🏗️ Database Models

### User Model
```typescript
interface User {
  id: number;           // Auto-incrementing primary key
  name: string;         // User's full name (2-100 chars)
  email: string;        // Unique email address
  createdAt: Date;      // Account creation timestamp
  updatedAt: Date;      // Last update timestamp
}
```

### Sequelize Configuration
- **Timestamps**: Automatically managed (`created_at`, `updated_at`)
- **Naming**: Snake_case for columns, PascalCase for models
- **Validation**: Built-in email and length validation
- **Indexes**: Email uniqueness, creation date for performance

## 🔄 Database Operations

### Development Mode
- **Auto-sync**: Tables created automatically on startup
- **Data persistence**: Changes saved to PostgreSQL
- **Hot reload**: Database connection maintained during development

### Production Mode
- **Migrations**: Use SQL migration files for schema changes
- **No auto-sync**: Tables must exist before startup
- **Connection pooling**: Optimized for production load

## 📊 Database Migrations

### Running Migrations
```bash
# Connect to your database
psql -U postgres -d booking_app

# Run migration
\i src/config/migrations/001-create-users-table.sql

# Verify table creation
\dt users
\d users
```

### Migration Benefits
- **Version control**: Track database schema changes
- **Team collaboration**: Consistent database structure
- **Rollback capability**: Revert schema changes if needed
- **Production safety**: No automatic table modifications

## 🌱 Database Seeding

### Running Seeders
```bash
# Connect to your database
psql -U postgres -d booking_app

# Run seeder
\i src/config/seeders/001-seed-users.sql

# Verify data
SELECT * FROM users;
```

### Seeder Benefits
- **Development data**: Sample data for testing
- **Consistent environment**: Same data across team members
- **Testing scenarios**: Predefined test cases
- **Documentation**: Examples of valid data

## 🔧 Advanced Configuration

### Connection Pooling
```typescript
pool: {
  max: 5,        // Maximum connections
  min: 0,        // Minimum connections
  acquire: 30000, // Connection acquisition timeout
  idle: 10000    // Connection idle timeout
}
```

### Logging
```typescript
logging: process.env.NODE_ENV === 'development' ? console.log : false
```

### SSL Configuration (for production)
```typescript
dialectOptions: {
  ssl: {
    require: true,
    rejectUnauthorized: false
  }
}
```

## 🧪 Testing with Database

### Test Database Setup
```typescript
// Create test database configuration
const testSequelize = new Sequelize({
  dialect: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'password',
  database: 'booking_app_test',
  logging: false
});

// Use in tests
beforeAll(async () => {
  await testSequelize.sync({ force: true });
});

afterAll(async () => {
  await testSequelize.close();
});
```

### Repository Testing
```typescript
// Mock the repository interface
const mockUserRepository: UserRepository = {
  findAll: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn()
};

// Test the service with mocked repository
const userService = new UserService(mockUserRepository);
```

## 📈 Performance Optimization

### Indexes
- **Primary Key**: `id` (auto-created)
- **Email**: Unique index for fast lookups
- **Created At**: Index for sorting and filtering

### Query Optimization
```typescript
// Use specific fields instead of SELECT *
const users = await UserModel.findAll({
  attributes: ['id', 'name', 'email'],
  where: { active: true },
  order: [['createdAt', 'DESC']],
  limit: 10
});
```

### Connection Management
- **Connection pooling**: Reuse connections
- **Transaction support**: ACID compliance
- **Prepared statements**: SQL injection protection

## 🚨 Troubleshooting

### Common Issues

#### Connection Refused
```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql

# Start PostgreSQL
sudo systemctl start postgresql
```

#### Authentication Failed
```bash
# Check pg_hba.conf for authentication method
sudo nano /etc/postgresql/*/main/pg_hba.conf

# Restart PostgreSQL after changes
sudo systemctl restart postgresql
```

#### Database Not Found
```bash
# List databases
psql -U postgres -l

# Create database if missing
createdb -U postgres booking_app
```

### Debug Mode
```typescript
// Enable detailed logging
logging: console.log,
logQueryParameters: true,
logQueryExecutionTime: true
```

## 🔮 Future Enhancements

### Planned Features
- **Migrations CLI**: Command-line migration management
- **Seeders CLI**: Automated data seeding
- **Database backup**: Automated backup scripts
- **Monitoring**: Database performance metrics
- **Replication**: Read replicas for scaling

### Migration Path
1. **Current**: Basic Sequelize setup
2. **Phase 1**: Migration management
3. **Phase 2**: Database monitoring
4. **Phase 3**: Advanced features (backup, replication)

## 📚 Resources

### Documentation
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Sequelize Documentation](https://sequelize.org/)
- [Node.js PostgreSQL](https://node-postgres.com/)

### Tools
- **pgAdmin**: PostgreSQL administration tool
- **DBeaver**: Universal database tool
- **TablePlus**: Modern database client

## 🎉 Conclusion

This database setup provides:
- ✅ **Clean Architecture compliance**
- ✅ **Production-ready configuration**
- ✅ **Development convenience**
- ✅ **Performance optimization**
- ✅ **Easy testing and seeding**

The combination of PostgreSQL and Sequelize gives you a robust, scalable database foundation that integrates seamlessly with your Clean Architecture! 🚀 