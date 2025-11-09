import swaggerJsdoc from 'swagger-jsdoc';
import { config } from './env.config';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Todo API Documentation',
      version: '1.0.0',
      description:
        'A production-ready REST API built with Node.js, TypeScript, Express, Prisma, PostgreSQL, and Redis',
      contact: {
        name: 'API Support',
        email: 'support@example.com',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: `http://localhost:${config.PORT}`,
        description: 'Development server',
      },
      {
        url: 'https://your-production-url.vercel.app',
        description: 'Production server',
      },
    ],
    tags: [
      {
        name: 'Todos',
        description: 'Todo management endpoints',
      },
    ],
    components: {
      schemas: {
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            message: {
              type: 'string',
              example: 'Error message',
            },
            errors: {
              type: 'array',
              items: {
                type: 'object',
              },
            },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
