import db from "../Utils/dataBaseConnection.js";

export default class Model {
    constructor(table) {
        this.db = db;
        this.table = table;
    }

    async getAll() {
        const [result] = await this.db.query(`SELECT * FROM ${this.table}`);
        if (result.length() === 0) return [];

        return result;
    }
}
