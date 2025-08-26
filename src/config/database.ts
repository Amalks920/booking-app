import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env['DB_HOST'] || 'localhost',
  port: parseInt(process.env['DB_PORT'] || '5432'),
  username: process.env['DB_USER'] || 'myuser',
  password: process.env['DB_PASSWORD'] || 'mypassword',
  database: process.env['DB_NAME'] || 'mydatabase',
  logging: process.env['NODE_ENV'] === 'development' ? console.log : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  define: {
    timestamps: true,
    underscored: true, // Use snake_case for column names
    freezeTableName: true // Don't pluralize table names
  }
});

export default sequelize;