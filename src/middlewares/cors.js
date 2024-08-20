import cors from 'cors';

const ACCEPTED_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:4200',
  'https://road2glory.netlify.app',
]
export const corsMiddleware = ({ acceptedOrigins = ACCEPTED_ORIGINS } = {}) => cors({
  origin: (origin, callback) => {
    if (acceptedOrigins.some(acceptedOrigin => {
      return typeof acceptedOrigin === 'string' ? acceptedOrigin === origin : acceptedOrigin.test(origin);
    })) {
      return callback(null, true);
    }

    if (!origin) {
      return callback(null, true);
    }

    console.log(`Blocked by CORS: ${origin}`);
    return callback(new Error('Not allowed by CORS'));
  }
})