import { Router } from 'express';
import { z } from 'zod';

const router = Router();

// Zod schema for registration
const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

// Middleware for validating request body
router.use((req, res, next) => {
  const result = registerSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: 'Invalid input', details: result.error.issues });
  }
  next();
});

router.post('/', (req, res) => {
  // Simulate registration logic
  res.status(201).json({ message: 'User registered', user: { email: req.body.email } });
});

export default router;
