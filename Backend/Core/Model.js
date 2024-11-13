import pkg from 'pg';

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

const { Client } = pkg;

class Model {
    #client = new Client(CONFIG);;
    #table;

    constructor(table) {
        this.#table = table;

        this.#connectToDatabase();
    }

    async getAll() {
        const [result] = await this.#client.query(`SELECT * FROM ${this.#table}`);
        if (result.length() === 0) return [];

        return result;
    }

    async #connectToDatabase() {
        try {
            await this.#client.connect();
            console.log('Connecto to PostgreSQL');
        } catch (err) {
            console.error('Connection error: ', err.stack);
        }
    }
}

export default Model;
