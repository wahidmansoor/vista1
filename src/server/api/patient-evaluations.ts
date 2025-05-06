import express, { Request, Response, Router } from 'express';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';

const router: Router = express.Router();

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl!, supabaseKey!);

// Validation schema for patient evaluation
const PatientEvaluationSchema = z.object({
  cancerType: z.string(),
  formData: z.record(z.string(), z.string()),
  timestamp: z.string().datetime()
});

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
  };
}

router.post('/', (req: AuthenticatedRequest, res: Response) => {
  const handleEvaluation = async () => {
    try {
      // Validate request body
      const validation = PatientEvaluationSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ 
          error: 'Invalid data format',
          details: validation.error.issues 
        });
      }

      const { cancerType, formData, timestamp } = validation.data;

      // Save to Supabase
      const { data, error } = await supabase
        .from('patient_evaluations')
        .insert([
          {
            cancer_type: cancerType,
            form_data: formData,
            timestamp,
            user_id: req.user?.id
          }
        ]);

      if (error) {
        console.error('Database error:', error);
        return res.status(500).json({ error: 'Failed to save evaluation' });
      }

      return res.status(201).json({ success: true, data });
    } catch (error) {
      console.error('Server error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };

  handleEvaluation();
});

export default router;