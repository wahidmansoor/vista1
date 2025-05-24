import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { validateEnv } from '../utils/validateEnv';
import patientEvaluations from './api/patient-evaluations';
import aiAgentRouter from './api/ai-agent';
import registerRouter from './routes/register';

validateEnv();

const app = express();

// Configure CORS with secure options
defineAllowedOrigins();
function defineAllowedOrigins() {
  const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:3000').split(',');
  app.use(cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true
  }));
}

// Helmet for security headers
app.use(helmet());

// Rate limiting for /api routes
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100
});
app.use('/api', limiter);

app.use(express.json());

// Test error route
app.get('/api/test-error', (_req: express.Request, _res: express.Response) => {
  throw new Error('Test error to verify error handling');
});

// API Routes
app.use('/api/patient-evaluations', patientEvaluations);
app.use('/api/ai-agent', aiAgentRouter);
app.use('/api/register', registerRouter);

// Async error handling middleware (should be last)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

export default app;
