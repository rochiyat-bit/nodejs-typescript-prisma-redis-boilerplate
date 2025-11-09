import { PrismaClient } from '@prisma/client';
import { logger } from './logger.config';

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: [
      {
        emit: 'event',
        level: 'query',
      },
      {
        emit: 'event',
        level: 'error',
      },
      {
        emit: 'event',
        level: 'info',
      },
      {
        emit: 'event',
        level: 'warn',
      },
    ],
  });
};

declare global {
  // eslint-disable-next-line no-var
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

// Log Prisma events
prisma.$on('query', (e) => {
  logger.debug('Query: ' + e.query);
  logger.debug('Duration: ' + e.duration + 'ms');
});

prisma.$on('error', (e) => {
  logger.error('Prisma error: ' + e.message);
});

prisma.$on('info', (e) => {
  logger.info('Prisma info: ' + e.message);
});

prisma.$on('warn', (e) => {
  logger.warn('Prisma warning: ' + e.message);
});

if (process.env.NODE_ENV !== 'production') {
  globalThis.prismaGlobal = prisma;
}

export const db = prisma;

// Graceful shutdown
export const disconnectDatabase = async (): Promise<void> => {
  await prisma.$disconnect();
  logger.info('Database disconnected');
};
