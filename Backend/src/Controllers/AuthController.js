import UserModel from '../Models/UserModel.js';
import { validateUser } from '../Schemas/userSchema.js';

export default class AuthController {
    static login(req, res) {
        res.send('Login');
    }

    static async register(req, res) {
        // Validate input
        const user = validateUser(req.body);
        if (!user.success) {
            const errorMessage = user.error.errors[0].message;
            return res.status(400).json({ error: errorMessage });
        }

        // Check for duplicated email or username
        const { email, username } = user.data;
        const isUnique = await UserModel.findOne({ email, username });
        if (isUnique) {
            const result = await UserModel.create({ input: user.data });
            return res.send('Registered.');
        }
        return res.send('Not registerd.');
    }

    static logout(req, res) {
        res.send('Logout');
    }

    static protectedTest(req, res) {}
}
