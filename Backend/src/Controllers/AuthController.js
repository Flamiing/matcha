import UserModel from '../Models/UserModel.js';
import { validateUser } from '../Schemas/userSchema.js';
import ErrorMessages from '../Utils/ErrorMessages.js';
import bcrypt from 'bcryptjs';

export default class AuthController {
    static login(req, res) {
        res.send('Login');
    }

    static async register(req, res) {
        // Validate input
        var user = validateUser(req.body);
        if (!user.success) {
            const errorMessage = user.error.errors[0].message;
            return res.status(400).json({ error: errorMessage });
        }

        // Check for duplicated email or username
        const { email, username, password } = user.data;
        const isUnique = await UserModel.findOne({ email, username });
        if (isUnique) {
            const { SALT_ROUNDS } = parseInt(process.env);
            user.data.password = bcrypt.hashSync(password, SALT_ROUNDS); // Encrypt password
            const result = await UserModel.create({ input: user.data });
            if (result === null) {
                return res
                    .status(500)
                    .json({ error: ErrorMessages.INTERNAL_SERVER_ERROR });
            } else if (result.length === 0) {
                return res
                    .status(400)
                    .json({ error: ErrorMessages.BAD_REQUEST });
            }
            const { id } = result;
            return res.json({ id });
        }
        return res.send('Not registerd.');
    }

    static logout(req, res) {
        res.send('Logout');
    }

    static protectedTest(req, res) {}
}
