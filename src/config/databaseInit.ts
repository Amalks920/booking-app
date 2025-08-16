import sequelize from './database';
import '../modules/users/infrastructure/models/User'; // Import models to register them

export const initializeDatabase = async (): Promise<void> => {
  try {
    // Test the database connection
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');

    // Sync all models with the database
    // In production, you should use migrations instead of sync
    if (process.env['NODE_ENV'] === 'development') {
      await sequelize.sync({ force: false }); // force: true will drop tables
      console.log('✅ Database models synchronized.');
    }

    console.log('🚀 Database initialization completed.');
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  }
};

export const closeDatabase = async (): Promise<void> => {
  try {
    await sequelize.close();
    console.log('✅ Database connection closed.');
  } catch (error) {
    console.error('❌ Error closing database connection:', error);
  }
}; 