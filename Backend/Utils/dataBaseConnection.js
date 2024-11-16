import dotenv from 'dotenv';
import pg from 'pg';
const { Client } = pg;

dotenv.config();

process.env;

const db = new Client({
    host: process.env.POSTGRESQL_HOST,
    user: process.env.POSTGRESQL_USER,
    password: process.env.POSTGRESQL_PASSWORD,
    database: process.env.POSTGRESQL_DATABASE,
    port: parseInt(process.env.POSTGRESQL_PORT ?? '5432'),
});

async function connectToDatabase() {
    await db.connect();
    console.log('Connected to the database.');
}

connectToDatabase();

export default db;
