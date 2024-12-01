// Third-Party Imports:
import bcrypt from 'bcryptjs';

// Local Imports:
import userModel from '../Models/UserModel.js';
import { validatePartialUser } from '../Schemas/userSchema.js';
import StatusMessage from '../Utils/StatusMessage.js';

export async function passwordValidations(data) {
    const { res, token, id, newPassword, oldPassword } = data;
    // Get the user and check if the account is active
    const user = await userModel.getById({ id });
    if (!user) {
        res.status(500).json({
            msg: StatusMessage.INTERNAL_SERVER_ERROR,
        });
        return false;
    } else if (user.length === 0) {
        res.status(400).json({ msg: StatusMessage.USER_NOT_FOUND });
        return false;
    }

    if (!user.active_account) {
        res.status(403).json({
            msg: StatusMessage.ACC_CONFIRMATION_REQUIRED,
        });
        return false;
    }

    // Check if the new password and old password are the same
    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
        console.log('HERE');
        res.status(400).json({ msg: StatusMessage.SAME_PASSWORD });
        return false;
    }

    // Checks if old password is valid
    if (oldPassword) {
        const isValidPassword = await bcrypt.compare(
            oldPassword,
            user.password
        );
        if (!isValidPassword) {
            res.status(401).json({ msg: StatusMessage.WRONG_PASSWORD });
            return false;
        }
    }

    if (token && !oldPassword && user.reset_pass_token === token) {
        const result = await userModel.update({
            input: { reset_pass_token: null },
            id: id,
        });
        if (!result) {
            res.status(500).json({
                msg: StatusMessage.INTERNAL_SERVER_ERROR,
            });
            return false;
        }
        if (result.length === 0) {
            res.status(400).json({ msg: StatusMessage.USER_NOT_FOUND });
            return false;
        }
    } else if (!user.reset_pass_token && !oldPassword) {
        res.status(400).json({ msg: StatusMessage.RESET_PASS_TOKEN_USED });
        return false;
    }

    // If everything is valid, returns true
    return true;
}

export async function loginValidations(reqBody, res) {
    // Validate and clean input
    const validatedUser = validatePartialUser(reqBody);
    if (!validatedUser.success) {
        const errorMessage = validatedUser.error.errors[0].message;
        return res.status(400).json({ msg: errorMessage });
    }

    // Checks if the user exists
    const { username, password } = validatedUser.data;
    const user = await userModel.findOne({ username });
    if (user.length === 0)
        return res.status(401).json({ msg: StatusMessage.WRONG_USERNAME });

    // Validates password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword)
        return res.status(401).json({ msg: StatusMessage.WRONG_PASSWORD });

    if (!user.active_account)
        return res
            .status(403)
            .json({ msg: StatusMessage.ACC_CONFIRMATION_REQUIRED });

    // Returns user
    return { user };
}

export async function confirmAccountValidations(res, tokenData) {
    const user = await userModel.getById(tokenData);
    if (!user) {
        res.status(500).json({ msg: StatusMessage.INTERNAL_SERVER_ERROR });
        return false;
    }
    if (user.length === 0) {
        res.status(400).json({ msg: StatusMessage.USER_NOT_FOUND });
        return false;
    }
    if (user.active_account) {
        res.status(400).json({ msg: StatusMessage.ACC_ALREADY_CONFIRMED });
        return false;
    }

    return true;
}
