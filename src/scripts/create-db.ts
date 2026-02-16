import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const createDb = async () => {
    const dbName = process.env.DB_NAME;
    if (!dbName) {
        console.error('❌ DB_NAME is not defined in environment variables');
        process.exit(1);
    }

    const client = new Client({
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT || '5432'),
        database: 'postgres', // Connect to default database
    });

    try {
        await client.connect();
        console.log(`🔌 Connected to postgres database to check for '${dbName}'...`);

        // Check if database exists
        const res = await client.query(`SELECT 1 FROM pg_database WHERE datname = $1`, [dbName]);

        if (res.rowCount === 0) {
            console.log(`Database '${dbName}' does not exist. Creating...`);
            // CREATE DATABASE cannot run locally in a transaction block, and updated pg drivers might affect how we run this.
            // But simple query usually works. parameterized queries don't work for identifiers like db name in CREATE DATABASE
            await client.query(`CREATE DATABASE "${dbName}"`);
            console.log(`✅ Database '${dbName}' created successfully.`);
        } else {
            console.log(`ℹ️ Database '${dbName}' already exists.`);
        }
    } catch (err) {
        console.error('❌ Error creating database:', err);
        process.exit(1);
    } finally {
        await client.end();
    }
};

createDb();
