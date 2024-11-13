import { Router } from "express";

import AuthController from "../Controllers/AuthController.js";

class AuthRouter {
    static createRouter() {
        const authRouter = Router();

        // GET:
        authRouter.get('/test', AuthController.testController);
        authRouter.get('/users', AuthController.getAllUsers);

        // POST:
        //authRouter.post('/login');
        //authRouter.post('/register');

        return authRouter;
    }
}

export default AuthRouter;