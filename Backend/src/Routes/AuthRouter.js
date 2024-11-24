import { Router } from 'express';

import AuthController from '../Controllers/AuthController.js';

export default class AuthRouter {
    static createRouter()  {
        const router = Router();

        // GET:
        router.get('/', (req, res) => {
            res.send("Hello World! TEST");
        });
        router.get('/protectedTest', AuthController.protectedTest);

        // POST:
        router.post('/login', AuthController.login);
        router.post('/register', AuthController.register);
        router.post('/logout', AuthController.logout);

        return router;
    }
    
}
