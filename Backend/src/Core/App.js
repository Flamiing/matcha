import express, { json } from 'express';
import 'dotenv/config';

// Routers:
import AuthRouter from "../Routes/AuthRouter.js";
import UsersRouter from "../Routes/UsersRouter.js";
import { corsMiddleware } from '../Middlewares/Cors.js';

export default class App {
    constructor() {
        this.app = express();
        this.PORT = process.env.BACKEND_PORT ?? 3001;
        this.API_VERSION = process.env.API_VERSION;
        this.API_PREFIX = `/api/v${this.API_VERSION}`;

        this.#setupMiddleware();
        this.#setupRoutes();
    }

    startApp() {
        this.app.listen(this.PORT, () => {
            console.log(`Server listening on http://localhost:${this.PORT}`)
        })
    }

    #setupMiddleware() {
        this.app.disable('x-powered-by') // Disable 'x-powered-by' header
        this.app.use(json());
        this.app.use(corsMiddleware());
    }

    #setupRoutes() {
        this.app.use(`${this.API_PREFIX}/auth`, AuthRouter.createRouter());
        this.app.use(`${this.API_PREFIX}/users`, UsersRouter.createRouter());
    }
}
