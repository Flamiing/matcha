import connectToDataBase from "../Utils/dataBaseConnection.js";

const client = connectToDataBase();

class Model {
    #client;
    #table;

    constructor(table, client) {
        this.#client = client;
        this.#table = table;
    }

    async getAll() {
        const [result] = await this.#client.query(`SELECT * FROM ${this.#table}`);
        if (result.length() === 0) return [];

        return result;
    }
}

export default Model;
