import UserModel from '../Models/UserModel.js';
import UserValidator from '../Validators/UserValidator.js';

export default class AuthController {
    static login(req, res) {
        res.send('Login');
    }

    static register(req, res) {
        // TODO: Validate data
        const user = req.body
        console.log('User: ', user);
        UserValidator.validate(user);
        // TODO: Validate that unique params are not already in the database
        res.send('Register');
    }

    static logout(req, res) {
        res.send('Logout');
    }

    static protectedTest(req, res) {}
}
