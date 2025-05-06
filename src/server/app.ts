import express from 'express';
import cors from 'cors';
import patientEvaluations from './api/patient-evaluations';

const app = express();

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/patient-evaluations', patientEvaluations);

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

export default app;