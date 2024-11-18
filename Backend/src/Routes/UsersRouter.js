import { Router } from "express";

import UsersController from "../Controllers/UsersController.js";

export default class UsersRouter {
    static createRouter() {
        const router = Router();

        // GET:
        router.get('/', UsersController.getAllUsers);
        router.get('/:id', UsersController.getUserById);
        
        // POST:
        router.post('/', UsersController.createUser);

        // PATCH:
        router.patch('/:id', UsersController.updateUser);

        // DELETE:
        router.delete('/:id', UsersController.deleteUser)

        return router;
    }
}
