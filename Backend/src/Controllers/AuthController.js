// Third-Party Imports:
import bcrypt from 'bcryptjs';

// Local Imports:
import userModel from '../Models/UserModel.js';
import { validateUser, validatePartialUser } from '../Schemas/userSchema.js';
import StatusMessage from '../Utils/StatusMessage.js';
import getPublicUser from '../Utils/getPublicUser.js';
import { createAccessToken } from '../Utils/jsonWebTokenUtils.js';
import { checkAuthStatus } from '../Utils/authUtils.js';

export default class AuthController {
    static async login(req, res) {
        // Check if user is logged in
        const authStatus = checkAuthStatus(req);
        if (authStatus.isAuthorized)
            return res
                .status(400)
                .json({ msg: StatusMessage.ALREADY_LOGGED_IN });

        // Validate and clean input
        const validatedUser = validatePartialUser(req.body);
        if (!validatedUser.success) {
            const errorMessage = validatedUser.error.errors[0].message;
            return res.status(400).json({ msg: errorMessage });
        }

        // Checks if the user exists
        const { username, password } = validatedUser.data;
        const user = await userModel.findOne({ username });
        if (user.length === 0) {
            return res.status(401).json({ msg: StatusMessage.WRONG_USERNAME });
        }

        // Validates password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ msg: StatusMessage.WRONG_PASSWORD });
        }

        // Create JWT
        const accessToken = createAccessToken(user);

        // Returns user
        const publicUser = getPublicUser(user);
        return res
            .cookie('access_token', accessToken, {
                httpOnly: true, // Cookie only accessible from the server
                secure: process.env.BACKEND_NODE_ENV === 'production', // Only accessible via https
                sameSite: 'strict', // Cookie only accessible from the same domain
                maxAge: 1000 * 60 * 60, // Cookie only valid for 1h
            })
            .json({ msg: publicUser });
    }

    static async register(req, res) {
        // Check if user is logged in
        const authStatus = checkAuthStatus(req);
        if (authStatus.isAuthorized)
            return res
                .status(400)
                .json({ msg: StatusMessage.ALREADY_LOGGED_IN });

        // Validate and clean input
        var validatedUser = validateUser(req.body);
        if (!validatedUser.success) {
            const errorMessage = validatedUser.error.errors[0].message;
            return res.status(400).json({ msg: errorMessage });
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
                    .json({ error: StatusMessage.INTERNAL_SERVER_ERROR });
            } else if (user.length === 0) {
                return res
                    .status(400)
                    .json({ error: StatusMessage.BAD_REQUEST });
            }

            // Returns id
            const publicUser = getPublicUser(user);
            return res.status(201).json({ msg: publicUser });
        }

        return res
            .status(400)
            .json({ msg: StatusMessage.USER_ALREADY_REGISTERED });
    }

    static logout(req, res) {
        // Check if user is logged in
        const authStatus = checkAuthStatus(req);
        if (!authStatus.isAuthorized)
            return res
                .status(400)
                .json({ msg: StatusMessage.ALREADY_LOGGED_OUT });

        return res
            .clearCookie('access_token')
            .json({ msg: StatusMessage.LOGOUT_SUCCESS });
    }

    static protected(req, res) {
        // Check if user is logged in
        const authStatus = checkAuthStatus(req);
        if (!authStatus.isAuthorized)
            return res
                .status(401)
                .json({ msg: StatusMessage.ACCESS_NOT_AUTHORIZED });

        res.json({
            msg: { id: authStatus.user.id, username: authStatus.user.username },
        });
    }

    static status(req, res) {
        const authStatus = checkAuthStatus(req);
        if (authStatus.isAuthorized) return res.status(200).json();
        return res.status(401).json();
    }
}
