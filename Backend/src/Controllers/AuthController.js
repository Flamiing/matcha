// Third-Party Imports:
import bcrypt from 'bcryptjs';

// Local Imports:
import userModel from '../Models/UserModel.js';
import { validateUser, validatePartialUser } from '../Schemas/userSchema.js';
import ErrorMessages from '../Utils/ErrorMessages.js';
import getPublicUser from '../Utils/getPublicUser.js';
import createJWT from '../Utils/createJWT.js';

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

        // Create JWT
        const token = createJWT(user);

        // Returns user
        const publicUser = getPublicUser(user);
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
            // Encrypt password
            validatedUser.data.password = await bcrypt.hash(
                password,
                SALT_ROUNDS
            );
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

            // Create JWT 
            const token = createJWT(user);

            // Returns id
            const publicUser = getPublicUser(user);
            return res.cookie('access_token', token, {
                httpOnly: true, // Cookie only accessible from the server
                secure: process.env.BACKEND_NODE_ENV === 'production', // Only accessible via https
                sameSite: 'strict', // Cookie only accessible from the same domain
                maxAge: 1000 * 60 * 60, // Cookie only valid for 1h
            }).json({ publicUser });
        }
        return res.send('Not registerd.');
    }

    static logout(req, res) {
        const { user } = req.session;
        if (!user)
            return res.json({ success: false, message: 'Already logged out.' });
        return res
            .clearCookie('access_token')
            .json({ sucess: true, message: 'Logout successful!' });
    }

    static protected(req, res) {
        const { user } = req.session;
        if (!user) return res.status(401).send('Access not authorized.');

        res.send(user);
    }
}
