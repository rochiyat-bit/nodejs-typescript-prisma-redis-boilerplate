import { db } from '../src/config/database.config';
import { connectRedis, disconnectRedis, getRedisClient } from '../src/config/redis.config';

// Setup before all tests
export const setupTests = async () => {
  // Connect to Redis
  await connectRedis();

  // Clean database
  await cleanDatabase();

  // Clean Redis cache
  await cleanCache();
};

// Teardown after all tests
export const teardownTests = async () => {
  await cleanDatabase();
  await cleanCache();
  await disconnectRedis();
  await db.$disconnect();
};

// Clean database
export const cleanDatabase = async () => {
  await db.todo.deleteMany({});
};

// Clean Redis cache
export const cleanCache = async () => {
  try {
    const redis = getRedisClient();
    await redis.flushDb();
  } catch (error) {
    // Redis might not be connected, ignore
  }
};
