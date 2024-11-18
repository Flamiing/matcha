import { Router } from "express";

import AuthController from "../Controllers/AuthController.js";

export default class AuthRouter {
    static createRouter() {
        const router = Router();

        // GET:

        // POST:
        //authRouter.post('/login');
        //authRouter.post('/register');

        return router;
    }
}
