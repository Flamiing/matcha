// Third-Party Imports:
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Local Imports:
import userModel from '../Models/UserModel.js';
import { validateUser, validatePartialUser } from '../Schemas/userSchema.js';
import ErrorMessages from '../Utils/ErrorMessages.js';

export default class AuthController {
    static async login(req, res) {
        // Validate and clean input
        const validatedUser = validatePartialUser(req.body);
        if (!validatedUser.success) {
            const errorMessage = validatedUser.error.errors[0].message;
            return res.status(400).json({ error: errorMessage });
        }

        // Checks if the user exists
        const { username, password } = validatedUser.data;
        const user = await userModel.findOne({ username });
        if (user.length === 0) {
            return res
                .status(401)
                .json({ error: ErrorMessages.WRONG_USERNAME });
        }

        // Validates password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res
                .status(401)
                .json({ error: ErrorMessages.WRONG_PASSWORD });
        }

        // Create JWT Token
        const { JWT_SECRET_KEY } = process.env;
        const token = jwt.sign(
            { id: user.id, username: user.username },
            JWT_SECRET_KEY,
            {
                expiresIn: '1h',
            }
        );

        // Returns user
        const publicUser = {
            id: user.id,
            username: user.username,
            first_name: user.first_name,
            last_name: user.last_name,
            age: user.age,
            biography: user.biography,
            profile_picture: user.profile_picture,
            location: user.location,
            fame: user.fame,
            last_online: user.last_online,
            is_online: user.is_online,
            gender: user.gender,
            sexual_preference: user.sexual_preference,
        };
        return res
            .cookie('access_token', token, {
                httpOnly: true, // Cookie only accessible from the server
                secure: process.env.BACKEND_NODE_ENV === 'production', // Only accessible via https
                sameSite: 'strict', // Cookie only accessible from the same domain
                maxAge: 1000 * 60 * 60, // Cookie only valid for 1h
            })
            .json({ publicUser });
    }

    static async register(req, res) {
        // Validate and clean input
        var validatedUser = validateUser(req.body);
        if (!validatedUser.success) {
            const errorMessage = validatedUser.error.errors[0].message;
            return res.status(400).json({ error: errorMessage });
        }

        // Check for duplicated user
        const { email, username, password } = validatedUser.data;
        const isUnique = await userModel.isUnique({ email, username });
        if (isUnique) {
            const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS);
            validatedUser.data.password = await bcrypt.hash(
                password,
                SALT_ROUNDS
            ); // Encrypt password
            const user = await userModel.create({ input: validatedUser.data });
            if (user === null) {
                return res
                    .status(500)
                    .json({ error: ErrorMessages.INTERNAL_SERVER_ERROR });
            } else if (user.length === 0) {
                return res
                    .status(400)
                    .json({ error: ErrorMessages.BAD_REQUEST });
            }

            // Returns id
            const { id } = user;
            return res.json({ id });
        }
        return res.send('Not registerd.');
    }

    static logout(req, res) {
        res.send('Logout');
    }

    static protected(req, res) {
        const { user } = req.session
        if (!user) return res.status(401).send('Access not authorized.');

        res.send(user);
    }
}
