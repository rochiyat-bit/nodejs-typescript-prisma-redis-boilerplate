import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import { config } from './config/env.config';
import { morganStream } from './config/logger.config';
import { swaggerSpec } from './config/swagger.config';
import { requestIdMiddleware } from './middlewares/requestId.middleware';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler.middleware';
import routes from './routes';

const app: Application = express();

// Security middleware
app.use(helmet());

// CORS
app.use(
  cors({
    origin: config.CORS_ORIGIN,
    credentials: true,
  })
);

// Request parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Compression
app.use(compression());

// Request ID tracking
app.use(requestIdMiddleware);

// Logging
if (config.NODE_ENV !== 'test') {
  app.use(morgan('combined', { stream: morganStream }));
}

// Rate limiting
const limiter = rateLimit({
  windowMs: config.RATE_LIMIT_WINDOW_MS,
  max: config.RATE_LIMIT_MAX_REQUESTS,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api', limiter);

// API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// API Routes
app.use('/api', routes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to Todo API',
    version: '1.0.0',
    documentation: '/api-docs',
  });
});

// 404 handler
app.use(notFoundHandler);

// Error handler (must be last)
app.use(errorHandler);

export default app;
