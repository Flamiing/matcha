// Third-Party Imports:
import jwt from 'jsonwebtoken';

// Local Imports:
import { checkAuthStatus } from '../Utils/authUtils';

export const refreshTokenMiddleware = () => (req, res, next) => {
    const authStatus = checkAuthStatus(req);
    

    next(); // Go to the next route or middleware
};
