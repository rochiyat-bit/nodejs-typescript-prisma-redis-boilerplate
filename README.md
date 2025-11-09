# Node.js TypeScript Prisma Redis Boilerplate

A production-ready REST API boilerplate built with Node.js, TypeScript, Express, Prisma (PostgreSQL), and Redis. This project includes a complete Todo CRUD application with caching, validation, testing, and comprehensive documentation.

## Features

- **TypeScript** - Type-safe code with strict mode enabled
- **Express.js** - Fast and minimalist web framework
- **Prisma ORM** - Modern database toolkit for PostgreSQL
- **Redis** - Caching layer for improved performance
- **Docker & Docker Compose** - Containerized development and deployment
- **Joi Validation** - Robust request validation
- **Swagger/OpenAPI** - Interactive API documentation
- **Mocha + Chai** - Unit and integration testing
- **Winston** - Structured logging
- **ESLint + Prettier** - Code linting and formatting
- **Security** - Helmet, CORS, Rate limiting
- **Vercel Ready** - Optimized for serverless deployment

## Architecture

The project follows clean architecture principles with clear separation of concerns:

```
src/
├── config/          # Configuration files (database, Redis, logger)
├── controllers/     # Route controllers (handle HTTP requests)
├── services/        # Business logic layer
├── repositories/    # Data access layer
├── middlewares/     # Custom middlewares
├── validators/      # Joi validation schemas
├── routes/          # API routes
├── types/           # TypeScript type definitions
├── utils/           # Utility functions and error classes
├── app.ts           # Express app setup
└── server.ts        # Server entry point
```

## Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- Docker and Docker Compose (for containerized setup)
- PostgreSQL (if running locally without Docker)
- Redis (if running locally without Docker)

## Quick Start

### 1. Clone the repository

```bash
git clone <repository-url>
cd nodejs-typescript-prisma-redis-boilerplate
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/todo_db?schema=public
REDIS_URL=redis://localhost:6379
```

### 4. Start with Docker (Recommended)

```bash
# Start all services (PostgreSQL, Redis, App)
npm run docker:up

# The API will be available at http://localhost:3000
# Swagger docs at http://localhost:3000/api-docs
```

### 5. Or run locally

```bash
# Start PostgreSQL and Redis with Docker
docker-compose up postgres redis -d

# Generate Prisma client
npm run prisma:generate

# Run database migrations and seed
npm run db:setup

# Or run them separately:
# npm run prisma:migrate
# npm run prisma:seed

# Start development server
npm run dev
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm test` | Run tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run prisma:generate` | Generate Prisma client |
| `npm run prisma:migrate` | Run database migrations |
| `npm run prisma:migrate:prod` | Run migrations in production |
| `npm run prisma:migrate:reset` | Reset database and re-run migrations |
| `npm run prisma:seed` | Seed database with sample data |
| `npm run prisma:studio` | Open Prisma Studio |
| `npm run db:setup` | Run migrations and seed database |
| `npm run db:reset` | Reset database and seed |
| `npm run docker:up` | Start Docker containers |
| `npm run docker:down` | Stop Docker containers |
| `npm run lint` | Lint code |
| `npm run lint:fix` | Lint and fix code |
| `npm run format` | Format code with Prettier |

## Database Migrations & Seeding

### Migrations

This project uses Prisma Migrate for database schema management.

#### Running Migrations

```bash
# Development - Run pending migrations
npm run prisma:migrate

# Production - Deploy migrations
npm run prisma:migrate:prod

# Reset database (⚠️ deletes all data)
npm run prisma:migrate:reset
```

#### Creating New Migrations

When you modify `prisma/schema.prisma`:

```bash
npx prisma migrate dev --name your_migration_name

# Examples:
# npx prisma migrate dev --name add_user_table
# npx prisma migrate dev --name add_email_to_user
```

### Database Seeding

The project includes a comprehensive seeding system that creates **25 sample todos** with realistic data.

#### Running Seeds

```bash
# Seed database manually
npm run prisma:seed

# Setup database (migrate + seed)
npm run db:setup

# Reset and seed
npm run db:reset
```

#### Seed Data Includes

- ✅ **9 pending todos** - Not yet started
- 🔄 **8 in-progress todos** - Currently being worked on
- ✅ **8 completed todos** - Finished tasks
- 🎯 **Mixed priorities** - Low, medium, and high priority items
- 📅 **Various due dates** - Past, present, and future deadlines

#### Customizing Seed Data

Edit the seed data in:
```
prisma/seeders/todo.seeder.ts
```

For detailed migration and seeding documentation, see [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md).

## API Endpoints

### Todos

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/todos` | Create a new todo |
| GET | `/api/todos` | Get all todos (with pagination & filtering) |
| GET | `/api/todos/:id` | Get todo by ID |
| PUT | `/api/todos/:id` | Update todo |
| DELETE | `/api/todos/:id` | Delete todo |

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Check server health |

### Documentation

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api-docs` | Swagger UI documentation |

## API Usage Examples

### Create Todo

```bash
curl -X POST http://localhost:3000/api/todos \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Complete project",
    "description": "Finish the boilerplate project",
    "priority": "high",
    "status": "pending",
    "dueDate": "2024-12-31T23:59:59Z"
  }'
```

### Get All Todos

```bash
# Basic request
curl http://localhost:3000/api/todos

# With filters and pagination
curl "http://localhost:3000/api/todos?page=1&limit=10&status=pending&priority=high&sortBy=createdAt&sortOrder=desc"
```

### Get Todo by ID

```bash
curl http://localhost:3000/api/todos/{todo-id}
```

### Update Todo

```bash
curl -X PUT http://localhost:3000/api/todos/{todo-id} \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated title",
    "status": "completed"
  }'
```

### Delete Todo

```bash
curl -X DELETE http://localhost:3000/api/todos/{todo-id}
```

## Response Format

### Success Response

```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error message",
  "errors": [
    {
      "field": "title",
      "message": "Title is required"
    }
  ]
}
```

## Todo Model

```typescript
{
  id: string (UUID)
  title: string (max 100 chars)
  description?: string (max 500 chars)
  status: 'pending' | 'in_progress' | 'completed'
  priority: 'low' | 'medium' | 'high'
  dueDate?: Date
  createdAt: Date
  updatedAt: Date
}
```

## Testing

The project includes comprehensive unit and integration tests.

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage (target: 80%)
npm run test:coverage
```

Test files are organized in:
- `tests/unit/` - Unit tests for services
- `tests/integration/` - Integration tests for API endpoints

## Redis Caching Strategy

The application implements a smart caching strategy:

- **Todo by ID**: Cached for 5 minutes
- **Todo List**: Cached with query parameters as key
- **Cache Invalidation**: Automatic on create, update, delete operations

Cache keys pattern: `todos:*`

## Database Migrations

```bash
# Create a new migration
npx prisma migrate dev --name migration_name

# Apply migrations in production
npm run prisma:migrate:prod

# Reset database (development only)
npx prisma migrate reset
```

## Deployment

### Deploy to Vercel

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Build the project:
```bash
npm run build
```

3. Deploy:
```bash
vercel
```

4. Set environment variables in Vercel dashboard:
   - `NODE_ENV=production`
   - `DATABASE_URL` (use connection pooling URL)
   - `REDIS_URL` (consider Upstash Redis)

### Deploy with Docker

```bash
# Build image
docker build -t todo-api .

# Run container
docker run -p 3000:3000 \
  -e DATABASE_URL=your_database_url \
  -e REDIS_URL=your_redis_url \
  todo-api
```

### Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Use PostgreSQL connection pooling (e.g., Prisma Data Proxy)
- [ ] Configure production Redis instance (e.g., Upstash)
- [ ] Set proper `CORS_ORIGIN`
- [ ] Configure rate limiting appropriately
- [ ] Enable HTTPS
- [ ] Set up monitoring and logging
- [ ] Configure database backups
- [ ] Set up CI/CD pipeline

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| NODE_ENV | Environment (development/production/test) | development |
| PORT | Server port | 3000 |
| DATABASE_URL | PostgreSQL connection string | - |
| REDIS_URL | Redis connection string | redis://localhost:6379 |
| REDIS_TTL | Cache TTL in seconds | 300 |
| CORS_ORIGIN | Allowed CORS origins | * |
| RATE_LIMIT_WINDOW_MS | Rate limit window | 900000 |
| RATE_LIMIT_MAX_REQUESTS | Max requests per window | 100 |
| LOG_LEVEL | Logging level | info |

## Project Structure Details

### Controllers
Handle HTTP requests and responses. Keep them thin - delegate business logic to services.

### Services
Contain business logic and orchestrate data operations. Handle caching strategy.

### Repositories
Direct database access using Prisma. One repository per model.

### Middlewares
- `errorHandler` - Global error handling
- `validation` - Request validation with Joi
- `asyncHandler` - Async route handler wrapper
- `requestId` - Request ID tracking

### Validators
Joi schemas for request validation with clear error messages.

## Best Practices

1. **Error Handling**: Use custom error classes for consistent error responses
2. **Validation**: Validate all inputs with Joi schemas
3. **Caching**: Cache expensive queries, invalidate on mutations
4. **Security**: Use Helmet, CORS, rate limiting
5. **Logging**: Use Winston for structured logging
6. **Testing**: Maintain 80%+ test coverage
7. **Code Quality**: Use ESLint and Prettier
8. **Documentation**: Keep Swagger docs updated
9. **Git**: Use conventional commits
10. **Performance**: Use connection pooling, indexes, caching

## Troubleshooting

### Database Connection Issues

```bash
# Check if PostgreSQL is running
docker ps

# View logs
docker logs todo-postgres
```

### Redis Connection Issues

```bash
# Check if Redis is running
docker ps

# Test Redis connection
docker exec -it todo-redis redis-cli ping
```

### Prisma Issues

```bash
# Regenerate Prisma client
npm run prisma:generate

# Reset database
npx prisma migrate reset
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit changes: `git commit -am 'Add my feature'`
4. Push to branch: `git push origin feature/my-feature`
5. Submit a pull request

## License

MIT

## Support

For issues and questions, please open an issue on GitHub.

## Acknowledgments

Built with modern Node.js best practices and production-ready patterns.
