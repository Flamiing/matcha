// Third-Party Imports:
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Local Imports:
import userModel from '../Models/UserModel.js';
import { validateUser, validatePartialUser } from '../Schemas/userSchema.js';
import { validatePartialPasswords } from '../Schemas/changePasswordSchema.js';
import StatusMessage from '../Utils/StatusMessage.js';
import getPublicUser from '../Utils/getPublicUser.js';
import {
    createAccessToken,
    createRefreshToken,
    createResetPasswordToken,
} from '../Utils/jsonWebTokenUtils.js';
import { checkAuthStatus, sendConfirmationEmail, sendResetPasswordEmail } from '../Utils/authUtils.js';

export default class AuthController {
    static async login(req, res) {
        // Check if user is logged in
        const authStatus = checkAuthStatus(req);
        if (authStatus.isAuthorized)
            return res
                .status(400)
                .json({ msg: StatusMessage.ALREADY_LOGGED_IN });

        // Validations
        const { user } = await AuthController.#loginValidations(req.body, res);
        if (!user) return res;

        // Create JWT
        await AuthController.#createAuthTokens(res, user);
        if (!('set-cookie' in res.getHeaders())) return res;

        // Returns user
        const publicUser = getPublicUser(user);
        return res.json({ msg: publicUser });
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
            .clearCookie('refresh_token')
            .json({ msg: StatusMessage.LOGOUT_SUCCESS });
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

            const user = await userModel.getById(data);
            if (!user || user.length === 0)
                return res.status(400).json({ msg: StatusMessage.BAD_REQUEST });
            if (user.active_account)
                return res
                    .status(400)
                    .json({ msg: StatusMessage.ACC_ALREADY_CONFIRMED });

            const result = await userModel.update({
                input: { active_account: true },
                id: data.id,
            });
            if (!result || result.length === 0)
                return res
                    .status(500)
                    .json({ msg: StatusMessage.INTERNAL_SERVER_ERROR });

            await AuthController.#createAuthTokens(res, data);
            if (!('set-cookie' in res.getHeaders())) return res;

            return res.json({ msg: StatusMessage.ACC_SUCCESSFULLY_CONFIRMED });
        } catch (error) {
            console.error('ERROR: ', error);
            if (error.name === 'TokenExpiredError') {
                const confirmationToken = req.query.token;
                const data = jwt.decode(confirmationToken);
                await sendConfirmationEmail(data);
                return res
                    .status(403)
                    .json({ msg: StatusMessage.CONFIRM_ACC_TOKEN_EXPIRED });
            }
            return res.status(400).json({ msg: StatusMessage.BAD_REQUEST });
        }
    }

    static async sendResetPasswordLink(req, res) {
        const { email } = req.body;
        if (!email)
            return res.status(400).json({ msg: StatusMessage.BAD_REQUEST });

        const user = await userModel.getByReference({ email: email });
        if (!user || user.length === 0) return res.status(400).json({ msg: StatusMessage.INVALID_EMAIL });
        if (!user.active_account)
            return res
                .status(403)
                .json({ msg: StatusMessage.CONFIRM_ACC_FIRST });

        const resetPasswordToken = createResetPasswordToken(user);
        const updatedUser = await userModel.update({ input: { reset_pass_token: resetPasswordToken }, id: user.id })
        if (!updatedUser || updatedUser.length === 0) return res.status(500).json({ msg: StatusMessage.INTERNAL_SERVER_ERROR });

        await sendResetPasswordEmail(updatedUser);

        return res.json({ msg: StatusMessage.RESET_PASS_EMAIL_SENT })

    }

    static async resetPassword(req, res) {
        const { JWT_SECRET_KEY } = process.env;
        const { token } = req.query;
        if (!token) return res.status(400).json({ msg: StatusMessage.BAD_REQUEST });

        const validationResult = validatePartialPasswords(req.body);
        
        try {
            const data = jwt.verify(token, JWT_SECRET_KEY);


        } catch (error) {
            console.error('ERROR: ', error);
            if (error.name === 'TokenExpiredError') {
                return res
                    .status(403)
                    .json({ msg: StatusMessage.RESET_PASS_TOKEN_EXPIRED });
            }
            return res.status(400).json({ msg: StatusMessage.BAD_REQUEST });
        }

    }

    static async changePassword(req, res) {}

    static async #loginValidations(reqBody, res) {
        // Validate and clean input
        const validatedUser = validatePartialUser(reqBody);
        if (!validatedUser.success) {
            const errorMessage = validatedUser.error.errors[0].message;
            return res.status(400).json({ msg: errorMessage });
        }

        // Checks if the user exists
        const { username, password } = validatedUser.data;
        const user = await userModel.findOne({ username });
        if (user.length === 0) return res.status(401).json({ msg: StatusMessage.WRONG_USERNAME });

        // Validates password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) return res.status(401).json({ msg: StatusMessage.WRONG_PASSWORD });

        if (!user.active_account)
            return res
                .status(403)
                .json({ msg: StatusMessage.ACC_CONFIRMATION_REQUIRED });

        // Returns user
        return { user };
    }

    static async #createAuthTokens(res, data) {
        const accessToken = createAccessToken(data);
        const refreshToken = createRefreshToken(data);
        const result = await userModel.update({
            input: { refresh_token: refreshToken },
            id: data.id,
        });
        if (!result || result.length === 0)
            return res
                .status(500)
                .json({ msg: StatusMessage.INTERNAL_SERVER_ERROR });

        return res
            .cookie('access_token', accessToken, {
                httpOnly: true, // Cookie only accessible from the server
                secure: process.env.BACKEND_NODE_ENV === 'production', // Only accessible via https
                sameSite: 'strict', // Cookie only accessible from the same domain
                maxAge: parseInt(process.env.ACCESS_TOKEN_EXPIRY_COOKIE), // Cookie only valid for 1h
            })
            .cookie('refresh_token', refreshToken, {
                httpOnly: true, // Cookie only accessible from the server
                secure: process.env.BACKEND_NODE_ENV === 'production', // Only accessible via https
                sameSite: 'strict', // Cookie only accessible from the same domain
                maxAge: parseInt(process.env.REFRESH_TOKEN_EXPIRY_COOKIE), // Cookie only valid for 30d
            });
    }
}
