// Third-Party Imports:
import jwt from 'jsonwebtoken';

export function createAccessToken(user) {
    const { JWT_SECRET_KEY, ACCESS_TOKEN_EXPIRY } = process.env;
    const accessToken = jwt.sign(
        { id: user.id, username: user.username },
        JWT_SECRET_KEY,
        {
            expiresIn: ACCESS_TOKEN_EXPIRY,
        }
    );

    return accessToken;
}

export function createRefreshToken(user) {
    const { JWT_SECRET_KEY, REFRESH_TOKEN_EXPIRY } = process.env;
    const refreshToken = jwt.sign(
        { id: user.id, username: user.username },
        JWT_SECRET_KEY,
        {
            expiresIn: REFRESH_TOKEN_EXPIRY,
        }
    );

    return refreshToken;
}
