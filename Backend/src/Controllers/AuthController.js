// Third-Party Imports:
import jwt from 'jsonwebtoken';

// Local Imports:
import userModel from '../Models/UserModel.js';
import { validateUser } from '../Schemas/userSchema.js';
import {
    validatePasswords,
    validatePartialPasswords,
} from '../Schemas/changePasswordSchema.js';
import StatusMessage from '../Utils/StatusMessage.js';
import getPublicUser from '../Utils/getPublicUser.js';
import {
    createAccessToken,
    createRefreshToken,
    createResetPasswordToken,
} from '../Utils/jsonWebTokenUtils.js';
import {
    checkAuthStatus,
    sendConfirmationEmail,
    sendResetPasswordEmail,
    hashPassword,
} from '../Utils/authUtils.js';
import {
    confirmAccountValidations,
    passwordValidations,
    loginValidations,
} from '../Validations/authValidations.js';

export default class AuthController {
    static async login(req, res) {
        // Check if user is logged in
        const authStatus = checkAuthStatus(req);
        if (authStatus.isAuthorized)
            return res
                .status(400)
                .json({ msg: StatusMessage.ALREADY_LOGGED_IN });

        // Validations
        const { user } = await loginValidations(req.body, res);
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
            // Encrypt password
            validatedUser.data.password = await hashPassword(password);

            const user = await userModel.create({ input: validatedUser.data });
            if (user === null) {
                return res
                    .status(500)
                    .json({ error: StatusMessage.INTERNAL_SERVER_ERROR });
            } else if (user.length === 0) {
                return res
                    .status(400)
                    .json({ error: StatusMessage.USER_NOT_FOUND });
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
            return res.status(400).json({ msg: StatusMessage.NOT_LOGGED_IN });

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
            const tokenData = jwt.verify(confirmationToken, JWT_SECRET_KEY);

            // Validations
            const validationResult = await confirmAccountValidations(
                res,
                tokenData
            );
            if (!validationResult) return res;

            const result = await userModel.update({
                input: { active_account: true },
                id: tokenData.id,
            });
            if (!result)
                return res
                    .status(500)
                    .json({ msg: StatusMessage.INTERNAL_SERVER_ERROR });
            if (result.length === 0)
                return res
                    .status(400)
                    .json({ msg: StatusMessage.USER_NOT_FOUND });

            await AuthController.#createAuthTokens(res, tokenData);
            if (!('set-cookie' in res.getHeaders())) return res;

            return res.json({ msg: StatusMessage.ACC_SUCCESSFULLY_CONFIRMED });
        } catch (error) {
            console.error('ERROR: ', error);
            if (error.name === 'TokenExpiredError') {
                const confirmationToken = req.query.token;
                const tokenData = jwt.decode(confirmationToken);

                const user = await userModel.findOne({ id: tokenData.id });
                if (!user)
                    return res
                        .status(500)
                        .json({ msg: StatusMessage.INTERNAL_SERVER_ERROR });
                if (user.length === 0)
                    return res
                        .status(400)
                        .json({ msg: StatusMessage.USER_NOT_FOUND });
                await sendConfirmationEmail(tokenData);
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
        if (!user)
            return res
                .status(500)
                .json({ msg: StatusMessage.INTERNAL_SERVER_ERROR });
        if (user.length === 0)
            return res.status(400).json({ msg: StatusMessage.INVALID_EMAIL });
        if (!user.active_account)
            return res
                .status(403)
                .json({ msg: StatusMessage.CONFIRM_ACC_FIRST });

        const resetPasswordToken = createResetPasswordToken(user);
        const updatedUser = await userModel.update({
            input: { reset_pass_token: resetPasswordToken },
            id: user.id,
        });
        if (!updatedUser)
            return res
                .status(500)
                .json({ msg: StatusMessage.INTERNAL_SERVER_ERROR });
        if (updatedUser.length === 0)
            return res.status(400).json({ msg: StatusMessage.USER_NOT_FOUND });

        await sendResetPasswordEmail(updatedUser);

        return res.json({ msg: StatusMessage.RESET_PASS_EMAIL_SENT });
    }

    static async resetPassword(req, res) {
        const { JWT_SECRET_KEY } = process.env;
        const { token } = req.query;
        if (!token)
            return res.status(400).json({ msg: StatusMessage.BAD_REQUEST });

        const validationResult = validatePartialPasswords(req.body);
        if (!validationResult.success) {
            const errorMessage = validationResult.error.errors[0].message;
            return res.status(400).json({ msg: errorMessage });
        }

        try {
            const tokenData = jwt.verify(token, JWT_SECRET_KEY);

            const data = {
                res: res,
                token: token,
                id: tokenData.id,
                newPassword: validationResult.data.new_password,
            };

            const result = await AuthController.#updatePassword(data);
            if (!result) return res;

            return res.json({ msg: StatusMessage.PASSWORD_UPDATED });
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

    static async changePassword(req, res) {
        const authStatus = checkAuthStatus(req);
        if (!authStatus.isAuthorized)
            return res.status(401).json({ msg: StatusMessage.NOT_LOGGED_IN });

        const validationResult = validatePasswords(req.body);
        if (!validationResult.success) {
            const errorMessage = validationResult.error.errors[0].message;
            return res.status(400).json({ msg: errorMessage });
        }

        const data = {
            res: res,
            id: req.session.user.id,
            newPassword: validationResult.data.new_password,
            oldPassword: validationResult.data.old_password,
        };

        const result = await AuthController.#updatePassword(data);
        if (!result) return res;

        return res.json({ msg: StatusMessage.PASSWORD_UPDATED });
    }

    static async #createAuthTokens(res, data) {
        const accessToken = createAccessToken(data);
        const refreshToken = createRefreshToken(data);
        const result = await userModel.update({
            input: { refresh_token: refreshToken },
            id: data.id,
        });
        if (!result)
            return res
                .status(500)
                .json({ msg: StatusMessage.INTERNAL_SERVER_ERROR });
        if (result.length === 0)
            return res.status(400).json({ msg: StatusMessage.USER_NOT_FOUND });

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

    static async #updatePassword(data) {
        const { id, newPassword } = data;

        const validationResult = await passwordValidations(data);
        if (!validationResult) return false;

        const newPasswordHashed = await hashPassword(newPassword);
        const updatedUser = await userModel.update({
            input: { password: newPasswordHashed },
            id: id,
        });
        if (!updatedUser) {
            res.status(500).json({ msg: StatusMessage.INTERNAL_SERVER_ERROR });
            return false;
        }
        if (updatedUser.length === 0) {
            res.status(400).json({ msg: StatusMessage.USER_NOT_FOUND });
            return false;
        }

        return true;
    }
}
