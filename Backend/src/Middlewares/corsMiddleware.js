// Third-Party Imports:
import cors from 'cors';
import 'dotenv/config';

const ACCEPTED_ORIGINS = process.env.ACCEPTED_ORIGINS;

export const corsMiddleware = ({ accepterOrigins = ACCEPTED_ORIGINS } = {}) =>
    cors({
        origin: (origin, callback) => {
            if (accepterOrigins.includes(origin) || !origin) {
                return callback(null, true);
            }

            return callback(new Error('Not allowed by CORS'));
        },
    });
