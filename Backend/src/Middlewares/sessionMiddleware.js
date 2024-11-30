// Third-Party Imports:
import jwt from 'jsonwebtoken';

export const sessionMiddleware = () => (req, res, next) => {
    const accessToken = req.cookies.access_token;

    req.session = { user: null };
    try {
        const { JWT_SECRET_KEY } = process.env;
        const data = jwt.verify(accessToken, JWT_SECRET_KEY);
        req.session.user = data;
    } catch (error) {
        console.error('ERROR: ', error);
    }

    next(); // Go to the next route or middleware
};
