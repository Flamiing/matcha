// Third-Party Imports:
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Local Imports:
import userModel from '../Models/UserModel.js';
import { validateUser, validatePartialUser } from '../Schemas/userSchema.js';
import StatusMessage from '../Utils/StatusMessage.js';
import getPublicUser from '../Utils/getPublicUser.js';
import { createAccessToken } from '../Utils/jsonWebTokenUtils.js';
import { checkAuthStatus, sendConfirmationEmail } from '../Utils/authUtils.js';

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

        if (!user.active_account) return res.status(403).json({ msg: StatusMessage.ACC_CONFIRMATION_REQUIRED })

        // Create JWT
        const accessToken = createAccessToken(user);

        // Returns user
        const publicUser = getPublicUser(user);
        return res
            .cookie('access_token', accessToken, {
                httpOnly: true, // Cookie only accessible from the server
                secure: process.env.BACKEND_NODE_ENV === 'production', // Only accessible via https
                sameSite: 'strict', // Cookie only accessible from the same domain
                maxAge: parseInt(process.env.ACCESS_TOKEN_EXPIRY_COOKIE), // Cookie only valid for 1h
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

            await sendConfirmationEmail(user);

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

    static async confirm(req, res) {
        // Check if user is logged in
        const authStatus = checkAuthStatus(req);
        if (authStatus.isAuthorized)
            return res
                .status(400)
                .json({ msg: StatusMessage.ALREADY_LOGGED_IN });
        try {
            const { JWT_SECRET_KEY } = process.env;
            const confirmationToken = req.query.token;
            const data = jwt.verify(confirmationToken, JWT_SECRET_KEY);
            console.log('ID: ', data.id)

            const result = await userModel.update({ input: { active_account: true }, id: data.id })
            if (!result || result.length === 0) return res.status(500).json({ msg: StatusMessage.INTERNAL_SERVER_ERROR })

            const accessToken = createAccessToken(data);

            return res.cookie('access_token', accessToken, {
                httpOnly: true, // Cookie only accessible from the server
                secure: process.env.BACKEND_NODE_ENV === 'production', // Only accessible via https
                sameSite: 'strict', // Cookie only accessible from the same domain
                maxAge: parseInt(process.env.ACCESS_TOKEN_EXPIRY_COOKIE), // Cookie only valid for 1h
            }).json({ msg: StatusMessage.ACC_SUCCESSFULLY_CONFIRMED })
        } catch (err) {
            console.error('ERROR: ', err);
            if (err.name === 'TokenExpiredError') {
                const confirmationToken = req.query.token;
                const data = jwt.decode(confirmationToken);
                await sendConfirmationEmail(data);
                return res.status(403).json({ msg: StatusMessage.CONFIRM_ACC_TOKEN_EXPIRED })
            }
            return res.status(400).json({ msg: StatusMessage.BAD_REQUEST })
        }
    }
}
