// Third-Party Imports:
import jwt from 'jsonwebtoken';

export const sessionMiddleware = (req, res, next) => {
    const token = req.cookies.access_token;

    req.session = { user: null };
    try {
        const { JWT_SECRET_KEY } = process.env;
        const data = jwt.verify(token, JWT_SECRET_KEY);
        req.session.user = data;
    } catch {}

    next(); // Go to the next route or middleware
};
