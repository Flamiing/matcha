import pg from 'pg';
const { Client } = pg;

// Get environment variables
const {
    POSTGRESQL_HOST,
    POSTGRESQL_PORT,
    POSTGRESQL_USER,
    POSTGRESQL_PASSWORD,
    POSTGRESQL_DATABASE } = process.env;

const CONFIG = {
    host: POSTGRESQL_HOST,
    port: POSTGRESQL_PORT,
    user: POSTGRESQL_USER,
    password: POSTGRESQL_PASSWORD,
    database: POSTGRESQL_DATABASE
};

async function connectToDataBase() {
    const client = new Client(CONFIG);

    try {
        await client.connect();
        console.log('Connecto to PostgreSQL');
    } catch (err) {
        await client.end();
        console.error('Connection error: ', err.stack);
    }

    return client;
}

export default connectToDataBase;