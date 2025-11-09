# Prisma Schema & Migrations

This directory contains the Prisma schema, migrations, and seeding scripts.

## Directory Structure

```
prisma/
├── schema.prisma              # Database schema definition
├── seed.ts                    # Main seed script
├── tsconfig.json              # TypeScript config for seed files
├── seeders/
│   └── todo.seeder.ts         # Todo seed data and logic
└── migrations/
    ├── 20240101000000_init/   # Initial migration
    │   └── migration.sql
    └── migration_lock.toml    # Migration lock file
```

## Quick Commands

```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations (dev)
npm run prisma:migrate

# Create new migration
npx prisma migrate dev --name migration_name

# Seed database
npm run prisma:seed

# Setup (migrate + seed)
npm run db:setup

# Reset database
npm run db:reset

# Open Prisma Studio
npm run prisma:studio
```

## Schema

The current schema includes:

### Todo Model
- **id**: UUID (Primary Key)
- **title**: String (max 100 chars)
- **description**: String (max 500 chars, optional)
- **status**: Enum (pending, in_progress, completed)
- **priority**: Enum (low, medium, high)
- **dueDate**: DateTime (optional)
- **createdAt**: DateTime (auto)
- **updatedAt**: DateTime (auto)

### Indexes
- status (for filtering)
- priority (for filtering)
- createdAt (for sorting)

## Seeding

The seed script creates 25 sample todos with:
- Various statuses (pending, in_progress, completed)
- Different priorities (low, medium, high)
- Realistic titles and descriptions
- Mixed due dates

To customize seed data, edit: `seeders/todo.seeder.ts`

## More Information

See [MIGRATION_GUIDE.md](../MIGRATION_GUIDE.md) for detailed documentation.
