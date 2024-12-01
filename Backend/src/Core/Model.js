// Local Imports:
import db from '../Utils/dataBaseConnection.js';

export default class Model {
    constructor(table) {
        this.db = db;
        this.table = table;
    }

    async getAll() {
        const query = {
            text: `SELECT * FROM ${this.table};`,
        };

        try {
            const result = await this.db.query(query);
            if (result.rows.length === 0) return [];
            return result.rows;
        } catch (error) {
            console.error('Error making the query: ', error.message);
            return null;
        }
    }

    async getById({ id }) {
        const query = {
            text: `SELECT * FROM ${this.table} WHERE id = $1;`,
            values: [id],
        };

        try {
            const result = await this.db.query(query);
            if (result.rows.length === 0) return [];
            return result.rows[0];
        } catch (error) {
            console.error('Error making the query: ', error.message);
            return null;
        }
    }

    async create({ input }) {
        const fields = Object.keys(input).join(', ');
        const values = Object.values(input);
        const placeholders = values
            .map((_, index) => `$${index + 1}`)
            .join(', ');

        const query = {
            text: `INSERT INTO ${this.table} (${fields}) VALUES (${placeholders}) RETURNING *;`,
            values: values,
        };

        try {
            const result = await this.db.query(query);
            if (result.rows.length === 0) return [];
            return result.rows[0];
        } catch (error) {
            console.error('Error making the query: ', error.message);
            return error;
        }
    }

    async update({ input, id }) {
        const fields = Object.keys(input)
            .map((key, index) => `${key} = $${index + 1}`)
            .join(', ');
        const values = Object.values(input);
        values.push(id);

        const query = {
            text: `UPDATE ${this.table} SET ${fields} WHERE id = $${values.length} RETURNING *;`,
            values: values,
        };

        try {
            const result = await this.db.query(query);
            if (result.rows.length === 0) return [];
            return result.rows[0];
        } catch (error) {
            console.error('Error making the query: ', error.message);
            return null;
        }
    }

    async delete({ id }) {
        const query = {
            text: `DELETE FROM ${this.table} WHERE id = $1 RETURNING *;`,
            values: [id],
        };

        try {
            const result = await this.db.query(query);
            if (result.rows[0] === undefined) return false;
            return true;
        } catch (error) {
            console.error('Error making the query: ', error.message);
            return null;
        }
    }

    async getByReference(reference) {
        const referenceName = Object.keys(reference)[0];
        const referenceValue = Object.values(reference)[0];

        const query = {
            text: `SELECT * FROM ${this.table} WHERE ${referenceName} = $1;`,
            values: [referenceValue],
        };

        try {
            const result = await this.db.query(query);
            if (result.rows.length === 0) return [];
            return result.rows[0];
        } catch (error) {
            console.error('Error making the query: ', error.message);
            return null;
        }
    }

    async findOne(input) {
        const fields = Object.keys(input)
            .map((key, index) => `${key} = $${index + 1}`)
            .join(' OR ');
        const values = Object.values(input);

        const query = {
            text: `SELECT * FROM ${this.table} WHERE ${fields};`,
            values: values,
        };

        try {
            const result = await this.db.query(query);
            if (result.rows.length === 0) return [];
            return result.rows[0];
        } catch (error) {
            console.error('Error making the query: ', error.message);
            return null;
        }
    }
}
