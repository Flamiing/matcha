// Third-Party Imports:
import jwt from 'jsonwebtoken';

export default function createJWT(user) {
    const { JWT_SECRET_KEY } = process.env;
    const token = jwt.sign(
        { id: user.id, username: user.username },
        JWT_SECRET_KEY,
        {
            expiresIn: '1h',
        }
    );

    return token;
}