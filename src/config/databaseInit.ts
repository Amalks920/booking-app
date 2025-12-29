import sequelize from './database';
// Import models to register them - must import before defining associations
import '../modules/users/infrastructure/models/User';
import '../modules/users/infrastructure/models/User_Profile';
import { defineUserAssociations } from '../modules/users/infrastructure/models/User';
import { defineUserProfileAssociations } from '../modules/users/infrastructure/models/User_Profile';
// Import property models
import '../modules/properties/infrastructure/models/Property';
import '../modules/properties/infrastructure/models/Room';
import '../modules/properties/infrastructure/models/Amenities';
import '../modules/properties/infrastructure/models/RoomAmenities';
import { definePropertyAssociations } from '../modules/properties/infrastructure/models/Property';
import { defineRoomAssociations } from '../modules/properties/infrastructure/models/Room';
import { defineAmenityAssociations } from '../modules/properties/infrastructure/models/Amenities';

export const initializeDatabase = async (): Promise<void> => {
  try {
    // Test the database connection
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');
    // Define associations after all models are loaded
    // This ensures both models are fully initialized before associations are created
    defineUserAssociations();
    defineUserProfileAssociations();
    // Define property module associations
    definePropertyAssociations();
    defineRoomAssociations();
    defineAmenityAssociations();

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