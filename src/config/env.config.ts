import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

interface EnvConfig {
  NODE_ENV: string;
  PORT: number;
  DATABASE_URL: string;
  REDIS_URL: string;
  REDIS_TTL: number;
  CORS_ORIGIN: string;
  RATE_LIMIT_WINDOW_MS: number;
  RATE_LIMIT_MAX_REQUESTS: number;
  LOG_LEVEL: string;
}

const getEnvConfig = (): EnvConfig => {
  return {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: parseInt(process.env.PORT || '3000', 10),
    DATABASE_URL: process.env.DATABASE_URL || '',
    REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',
    REDIS_TTL: parseInt(process.env.REDIS_TTL || '300', 10), // 5 minutes default
    CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
    RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes
    RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
    LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  };
};

export const config = getEnvConfig();

// Validate required environment variables
export const validateEnv = (): void => {
  const requiredEnvVars = ['DATABASE_URL'];

  const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);

  if (missingEnvVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingEnvVars.join(', ')}`
    );
  }
};
