import sequelize from '../config/database';
import dotenv from 'dotenv';

dotenv.config();

async function testConnection() {
  try {
    console.log('🔍 Testing database connection...');
    console.log('📋 Connection details:');
    console.log(`   Host: ${process.env['DB_HOST'] || 'localhost'}`);
    console.log(`   Port: ${process.env['DB_PORT'] || '5432'}`);
    console.log(`   Database: ${process.env['DB_NAME'] || 'booking_app'}`);
    console.log(`   User: ${process.env['DB_USER'] || 'postgres'}`);
    
    // Test the connection
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully!');
    
    // Get database info
    const [results] = await sequelize.query('SELECT version()');
    console.log('📊 PostgreSQL version:', results);
    
    // Close the connection
    await sequelize.close();
    console.log('✅ Connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database connection failed:');
    if (error instanceof Error) {
      console.error('   Error:', error.message);
      console.error('   Details:', error);
    } else {
      console.error('   Unknown error:', error);
    }
    process.exit(1);
  }
}

testConnection();

