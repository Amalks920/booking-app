
import dotenv from 'dotenv';
dotenv.config();
import { initializeDatabase, closeDatabase } from '../config/databaseInit';

const verify = async () => {
    try {
        console.log('Starting verification...');
        await initializeDatabase();
        console.log('Verification successful!');
        await closeDatabase();
        process.exit(0);
    } catch (error) {
        console.error('Verification failed:', error);
        process.exit(1);
    }
};

verify();
