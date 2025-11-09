import { Router } from 'express';
import todoRoutes from './todo.routes';

const router = Router();

// Health check
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is healthy',
    timestamp: new Date().toISOString(),
  });
});

// API routes
router.use('/todos', todoRoutes);

export default router;
