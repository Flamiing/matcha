import userModel from '../Models/UserModel.js';
import { validateUser, validatePartialUser } from '../Schemas/userSchema.js';
import ErrorMessages from '../Utils/ErrorMessages.js';
import bcrypt from 'bcryptjs';

export default class AuthController {
    static async login(req, res) {
        // Validate and clean input
        const user = validatePartialUser(req.body);
        if (!user.success) {
            const errorMessage = user.error.errors[0].message;
            return res.status(400).json({ error: errorMessage });
        }

        // Checks if the user exists
        const { username, password } = user.data;
        const result = await userModel.findOne({ username });
        if (result.length === 0) {
            return res
                .status(400)
                .json({ error: ErrorMessages.WRONG_USERNAME });
        }

        // Validates password
        const isValidPassword = await bcrypt.compare(password, result.password);
        if (!isValidPassword) {
            return res
                .status(400)
                .json({ error: ErrorMessages.WRONG_PASSWORD });
        }

        // Returns user
        const publicUser = {
            id: result.id,
            username: result.username,
            first_name: result.first_name,
            last_name: result.last_name,
            age: result.age,
            biography: result.biography,
            profile_picture: result.profile_picture,
            location: result.location,
            fame: result.fame,
            last_online: result.last_online,
            is_online: result.is_online,
            gender: result.gender,
            sexual_preference: result.sexual_preference,
        };
        return res.json({ publicUser });
    }

    static async register(req, res) {
        // Validate and clean input
        var user = validateUser(req.body);
        if (!user.success) {
            const errorMessage = user.error.errors[0].message;
            return res.status(400).json({ error: errorMessage });
        }

        // Check for duplicated user
        const { email, username, password } = user.data;
        const isUnique = await userModel.isUnique({ email, username });
        if (isUnique) {
            const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS);
            user.data.password = await bcrypt.hash(password, SALT_ROUNDS); // Encrypt password
            const result = await userModel.create({ input: user.data });
            if (result === null) {
                return res
                    .status(500)
                    .json({ error: ErrorMessages.INTERNAL_SERVER_ERROR });
            } else if (result.length === 0) {
                return res
                    .status(400)
                    .json({ error: ErrorMessages.BAD_REQUEST });
            }

            // Returns id
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
