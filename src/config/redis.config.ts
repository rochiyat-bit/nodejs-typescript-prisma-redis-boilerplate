import { createClient, RedisClientType } from 'redis';
import { config } from './env.config';
import { logger } from './logger.config';

let redisClient: RedisClientType | null = null;

export const connectRedis = async (): Promise<RedisClientType> => {
  if (redisClient) {
    return redisClient;
  }

  try {
    const client = createClient({
      url: config.REDIS_URL,
    });

    client.on('error', (err) => {
      logger.error('Redis Client Error', err);
    });

    client.on('connect', () => {
      logger.info('Redis client connected');
    });

    client.on('ready', () => {
      logger.info('Redis client ready');
    });

    client.on('reconnecting', () => {
      logger.warn('Redis client reconnecting');
    });

    await client.connect();

    redisClient = client;
    return client;
  } catch (error) {
    logger.error('Failed to connect to Redis:', error);
    throw error;
  }
};

export const getRedisClient = (): RedisClientType => {
  if (!redisClient) {
    throw new Error('Redis client not initialized. Call connectRedis first.');
  }
  return redisClient;
};

export const disconnectRedis = async (): Promise<void> => {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
    logger.info('Redis disconnected');
  }
};

// Cache helper functions
export const cacheGet = async (key: string): Promise<string | null> => {
  try {
    const client = getRedisClient();
    return await client.get(key);
  } catch (error) {
    logger.error(`Cache get error for key ${key}:`, error);
    return null;
  }
};

export const cacheSet = async (
  key: string,
  value: string,
  ttl: number = config.REDIS_TTL
): Promise<void> => {
  try {
    const client = getRedisClient();
    await client.setEx(key, ttl, value);
  } catch (error) {
    logger.error(`Cache set error for key ${key}:`, error);
  }
};

export const cacheDel = async (key: string): Promise<void> => {
  try {
    const client = getRedisClient();
    await client.del(key);
  } catch (error) {
    logger.error(`Cache delete error for key ${key}:`, error);
  }
};

export const cacheDelPattern = async (pattern: string): Promise<void> => {
  try {
    const client = getRedisClient();
    const keys = await client.keys(pattern);
    if (keys.length > 0) {
      await client.del(keys);
    }
  } catch (error) {
    logger.error(`Cache delete pattern error for pattern ${pattern}:`, error);
  }
};
