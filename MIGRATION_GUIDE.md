# Database Migrations & Seeding Guide

This guide explains how to work with database migrations and seeding in this project using Prisma.

## Table of Contents

- [Overview](#overview)
- [Migrations](#migrations)
- [Seeding](#seeding)
- [Common Workflows](#common-workflows)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

## Overview

This project uses **Prisma** as the ORM, which provides a robust migration system and seeding capabilities.

### What are Migrations?

Migrations are version-controlled changes to your database schema. Each migration represents a step in the evolution of your database structure.

### What is Seeding?

Seeding is the process of populating your database with initial or sample data for development, testing, or demo purposes.

## Migrations

### Initial Setup

The project comes with an initial migration that creates the Todo table:

```
prisma/migrations/20240101000000_init/migration.sql
```

### Running Migrations

#### Development Environment

```bash
# Run all pending migrations
npm run prisma:migrate

# This will:
# 1. Apply migrations to the database
# 2. Generate Prisma Client
# 3. (Optional) Run seed script
```

#### Production Environment

```bash
# Apply migrations without prompts (for CI/CD)
npm run prisma:migrate:prod
```

### Creating New Migrations

When you modify the `prisma/schema.prisma` file, create a new migration:

```bash
# Create a new migration with a descriptive name
npx prisma migrate dev --name add_user_table

# Example names:
# - add_user_table
# - add_email_to_user
# - create_indexes_on_todos
# - add_cascade_delete
```

This will:
1. Create a new migration file in `prisma/migrations/`
2. Apply the migration to your database
3. Regenerate Prisma Client

### Migration Files

Migration files are located in:
```
prisma/migrations/
├── 20240101000000_init/
│   └── migration.sql
├── [timestamp]_[migration_name]/
│   └── migration.sql
└── migration_lock.toml
```

### Viewing Migration Status

```bash
# Check which migrations have been applied
npx prisma migrate status
```

### Resetting the Database

**⚠️ Warning: This will delete all data!**

```bash
# Reset database and re-run all migrations
npm run prisma:migrate:reset

# Reset and seed
npm run db:reset
```

## Seeding

### Overview

The project includes a comprehensive seeding system that populates the database with sample Todo data.

### Seed Data

The seed creates **25 sample todos** with:
- ✅ Different statuses: pending, in_progress, completed
- 🎯 Different priorities: low, medium, high
- 📅 Various due dates (past, present, future)
- 📝 Realistic titles and descriptions

### Running Seeds

#### Manual Seeding

```bash
# Run seed script manually
npm run prisma:seed
```

#### Automatic Seeding

Seeds run automatically when you:

```bash
# Setup database (migrate + seed)
npm run db:setup

# Reset database (reset + seed)
npm run db:reset

# Run migrations in development (includes seed)
npm run prisma:migrate
```

### Seed Output

When seeding completes, you'll see:

```
🚀 Starting database seeding...

🌱 Seeding todos...
   Cleared existing todos
   ✅ Created 25 todos
   📊 Breakdown:
      - pending: 9 todos
      - in_progress: 8 todos
      - completed: 8 todos
   🎯 Priority breakdown:
      - low: 5 todos
      - medium: 10 todos
      - high: 10 todos

✅ Database seeding completed successfully!
```

### Customizing Seed Data

To customize seed data, edit:

```
prisma/seeders/todo.seeder.ts
```

Example - Adding a new todo:

```typescript
const todoSeedData: TodoSeedData[] = [
  // ... existing todos
  {
    title: 'Your custom todo',
    description: 'Custom description',
    status: 'pending',
    priority: 'high',
    dueDate: new Date('2024-12-31'),
  },
];
```

### Creating Additional Seeders

To add more seeders (e.g., for users, categories):

1. Create a new seeder file:
```typescript
// prisma/seeders/user.seeder.ts
export async function seedUsers() {
  // Your seeding logic
}
```

2. Import and call in `prisma/seed.ts`:
```typescript
import seedTodos from './seeders/todo.seeder';
import seedUsers from './seeders/user.seeder';

async function main() {
  await seedTodos();
  await seedUsers();
}
```

## Common Workflows

### First Time Setup

```bash
# 1. Install dependencies
npm install

# 2. Setup environment
cp .env.example .env
# Edit .env with your database URL

# 3. Generate Prisma Client
npm run prisma:generate

# 4. Run migrations and seed
npm run db:setup
```

### Starting Fresh Development

```bash
# Reset everything and start fresh
npm run db:reset
```

### Adding a New Model

```bash
# 1. Edit prisma/schema.prisma
# Add your new model

# 2. Create migration
npx prisma migrate dev --name add_new_model

# 3. (Optional) Create seeder for new model
# Create prisma/seeders/new-model.seeder.ts

# 4. Update prisma/seed.ts
# Import and call your new seeder
```

### Production Deployment

```bash
# 1. Build application
npm run build

# 2. Run migrations (no prompts)
npm run prisma:migrate:prod

# 3. (Optional) Seed production data
# Only if you need initial data
npm run prisma:seed

# 4. Start application
npm start
```

## Best Practices

### Migrations

1. **Never edit existing migrations** - Create new ones instead
2. **Use descriptive names** - `add_user_email` not `update`
3. **Review SQL** - Always check generated SQL before applying
4. **Test migrations** - Test on a copy of production data
5. **Keep migrations small** - One logical change per migration
6. **Version control** - Always commit migration files

### Seeding

1. **Idempotent seeds** - Seeds should work multiple times
2. **Clear before seeding** - Always clear data before re-seeding
3. **Realistic data** - Use realistic data for better testing
4. **Environment aware** - Don't seed production automatically
5. **Document seeds** - Explain what data is created

### Schema Changes

1. **Backward compatible** - When possible, make non-breaking changes
2. **Data migration** - Consider existing data when changing schema
3. **Indexes** - Add indexes for frequently queried fields
4. **Constraints** - Use database constraints for data integrity

## Troubleshooting

### Migration Fails

```bash
# Error: Migration failed to apply

# Solution 1: Check database connection
# Verify DATABASE_URL in .env

# Solution 2: Reset and try again
npm run prisma:migrate:reset

# Solution 3: Manual fix
# 1. Check the migration SQL file
# 2. Fix any syntax errors
# 3. Create a new migration with fixes
```

### Seed Fails

```bash
# Error: Seeding failed

# Solution 1: Check Prisma Client
npm run prisma:generate

# Solution 2: Clear database
npx prisma migrate reset

# Solution 3: Check seed script
# Review prisma/seed.ts for errors
```

### Out of Sync

```bash
# Database schema doesn't match Prisma schema

# Solution: Push schema to database
npm run prisma:db:push

# Or reset everything
npm run db:reset
```

### Migration Conflicts

```bash
# Multiple developers created migrations

# Solution 1: Resolve in team
# 1. Coordinate with team
# 2. Decide which migration to keep
# 3. Others create new migrations based on winner

# Solution 2: Reset local database
npm run db:reset
```

### Prisma Client Out of Date

```bash
# Error: Prisma Client is out of date

# Solution: Regenerate client
npm run prisma:generate
```

## Advanced Topics

### Custom Migration SQL

You can edit migration SQL before applying:

```bash
# Create migration with --create-only
npx prisma migrate dev --create-only --name custom_indexes

# Edit the generated SQL file
# Then apply:
npx prisma migrate dev
```

### Database Push (Development Only)

For rapid prototyping, push schema without creating migrations:

```bash
npm run prisma:db:push
```

**⚠️ Warning:** This doesn't create migration history!

### Prisma Studio

Visual database browser:

```bash
npm run prisma:studio

# Opens at http://localhost:5555
```

### Connection Pooling

For production, use connection pooling:

```env
# .env
DATABASE_URL="postgresql://user:password@host:5432/db?schema=public&connection_limit=10&pool_timeout=20"
```

## Scripts Reference

| Script | Description |
|--------|-------------|
| `npm run prisma:generate` | Generate Prisma Client |
| `npm run prisma:migrate` | Run migrations (dev) |
| `npm run prisma:migrate:prod` | Run migrations (production) |
| `npm run prisma:migrate:reset` | Reset and re-run all migrations |
| `npm run prisma:seed` | Run seed script |
| `npm run prisma:studio` | Open Prisma Studio |
| `npm run prisma:db:push` | Push schema to DB (no migration) |
| `npm run db:setup` | Migrate + Seed |
| `npm run db:reset` | Reset + Seed |

## Resources

- [Prisma Migrations Documentation](https://www.prisma.io/docs/concepts/components/prisma-migrate)
- [Prisma Seeding Documentation](https://www.prisma.io/docs/guides/database/seed-database)
- [Prisma Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
- [Prisma Client API](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference)

## Need Help?

If you encounter issues not covered here:

1. Check [Prisma Documentation](https://www.prisma.io/docs)
2. Search [Prisma GitHub Issues](https://github.com/prisma/prisma/issues)
3. Ask on [Prisma Discord](https://pris.ly/discord)
