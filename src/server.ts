import app from './app';
import { config, validateEnv } from './config/env.config';
import { logger } from './config/logger.config';
import { connectRedis, disconnectRedis } from './config/redis.config';
import { disconnectDatabase } from './config/database.config';

// Validate environment variables
validateEnv();

const PORT = config.PORT;

// Initialize connections and start server
const startServer = async () => {
  try {
    // Connect to Redis
    await connectRedis();
    logger.info('Redis connected successfully');

    // Start Express server
    const server = app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
      logger.info(`Environment: ${config.NODE_ENV}`);
      logger.info(`API Documentation: http://localhost:${PORT}/api-docs`);
    });

    // Graceful shutdown
    const gracefulShutdown = async (signal: string) => {
      logger.info(`${signal} received. Starting graceful shutdown...`);

      server.close(async () => {
        logger.info('HTTP server closed');

        try {
          // Disconnect from Redis
          await disconnectRedis();

          // Disconnect from database
          await disconnectDatabase();

          logger.info('All connections closed. Exiting...');
          process.exit(0);
        } catch (error) {
          logger.error('Error during graceful shutdown:', error);
          process.exit(1);
        }
      });

      // Force shutdown after 10 seconds
      setTimeout(() => {
        logger.error('Forced shutdown after timeout');
        process.exit(1);
      }, 10000);
    };

    // Handle shutdown signals
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    // Handle uncaught exceptions
    process.on('uncaughtException', (error: Error) => {
      logger.error('Uncaught Exception:', error);
      gracefulShutdown('uncaughtException');
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason: any) => {
      logger.error('Unhandled Rejection:', reason);
      gracefulShutdown('unhandledRejection');
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();
