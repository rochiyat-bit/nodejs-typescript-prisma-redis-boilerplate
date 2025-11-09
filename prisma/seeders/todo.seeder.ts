import { PrismaClient, TodoStatus, TodoPriority } from '@prisma/client';

const prisma = new PrismaClient();

interface TodoSeedData {
  title: string;
  description?: string;
  status: TodoStatus;
  priority: TodoPriority;
  dueDate?: Date;
}

// Sample todo data for different scenarios
const todoSeedData: TodoSeedData[] = [
  // Pending todos
  {
    title: 'Setup development environment',
    description: 'Install Node.js, PostgreSQL, Redis, and Docker on local machine',
    status: 'pending',
    priority: 'high',
    dueDate: new Date('2024-12-31'),
  },
  {
    title: 'Review pull requests',
    description: 'Review and approve pending pull requests from team members',
    status: 'pending',
    priority: 'medium',
    dueDate: new Date('2024-12-25'),
  },
  {
    title: 'Update project dependencies',
    description: 'Update all npm packages to their latest stable versions',
    status: 'pending',
    priority: 'low',
    dueDate: new Date('2025-01-15'),
  },
  {
    title: 'Write API documentation',
    description: 'Complete API documentation using Swagger/OpenAPI specifications',
    status: 'pending',
    priority: 'high',
    dueDate: new Date('2024-12-20'),
  },
  {
    title: 'Refactor authentication module',
    description: 'Improve code quality and security in the authentication module',
    status: 'pending',
    priority: 'medium',
  },

  // In Progress todos
  {
    title: 'Implement user authentication',
    description: 'Add JWT-based authentication with refresh token support',
    status: 'in_progress',
    priority: 'high',
    dueDate: new Date('2024-12-18'),
  },
  {
    title: 'Add integration tests',
    description: 'Write comprehensive integration tests for all API endpoints',
    status: 'in_progress',
    priority: 'high',
    dueDate: new Date('2024-12-22'),
  },
  {
    title: 'Optimize database queries',
    description: 'Add indexes and optimize slow queries identified in production',
    status: 'in_progress',
    priority: 'medium',
    dueDate: new Date('2024-12-28'),
  },
  {
    title: 'Setup CI/CD pipeline',
    description: 'Configure GitHub Actions for automated testing and deployment',
    status: 'in_progress',
    priority: 'high',
    dueDate: new Date('2024-12-19'),
  },
  {
    title: 'Implement rate limiting',
    description: 'Add rate limiting to prevent API abuse',
    status: 'in_progress',
    priority: 'medium',
  },

  // Completed todos
  {
    title: 'Initialize project repository',
    description: 'Create Git repository and setup initial project structure',
    status: 'completed',
    priority: 'high',
    dueDate: new Date('2024-11-01'),
  },
  {
    title: 'Setup TypeScript configuration',
    description: 'Configure TypeScript with strict mode and proper compiler options',
    status: 'completed',
    priority: 'high',
    dueDate: new Date('2024-11-02'),
  },
  {
    title: 'Configure ESLint and Prettier',
    description: 'Setup code linting and formatting tools',
    status: 'completed',
    priority: 'medium',
    dueDate: new Date('2024-11-03'),
  },
  {
    title: 'Setup Prisma ORM',
    description: 'Install and configure Prisma with PostgreSQL',
    status: 'completed',
    priority: 'high',
    dueDate: new Date('2024-11-05'),
  },
  {
    title: 'Implement Redis caching',
    description: 'Add Redis for caching frequently accessed data',
    status: 'completed',
    priority: 'medium',
    dueDate: new Date('2024-11-10'),
  },
  {
    title: 'Create Docker configuration',
    description: 'Setup Docker and Docker Compose for development',
    status: 'completed',
    priority: 'high',
    dueDate: new Date('2024-11-08'),
  },
  {
    title: 'Add error handling middleware',
    description: 'Implement global error handling and custom error classes',
    status: 'completed',
    priority: 'high',
    dueDate: new Date('2024-11-12'),
  },
  {
    title: 'Setup logging system',
    description: 'Configure Winston for structured logging',
    status: 'completed',
    priority: 'medium',
    dueDate: new Date('2024-11-11'),
  },

  // Additional varied todos
  {
    title: 'Research new technologies',
    description: 'Explore GraphQL, WebSockets, and other emerging technologies',
    status: 'pending',
    priority: 'low',
  },
  {
    title: 'Performance optimization',
    description: 'Profile application and optimize critical paths',
    status: 'in_progress',
    priority: 'high',
    dueDate: new Date('2024-12-30'),
  },
  {
    title: 'Security audit',
    description: 'Conduct comprehensive security audit and fix vulnerabilities',
    status: 'pending',
    priority: 'high',
    dueDate: new Date('2024-12-27'),
  },
  {
    title: 'Code review guidelines',
    description: 'Create documentation for code review best practices',
    status: 'completed',
    priority: 'low',
    dueDate: new Date('2024-11-15'),
  },
  {
    title: 'Setup monitoring and alerts',
    description: 'Configure application monitoring with Prometheus and Grafana',
    status: 'pending',
    priority: 'medium',
    dueDate: new Date('2025-01-05'),
  },
  {
    title: 'Database backup strategy',
    description: 'Implement automated database backup and recovery procedures',
    status: 'in_progress',
    priority: 'high',
    dueDate: new Date('2024-12-21'),
  },
  {
    title: 'API versioning',
    description: 'Implement API versioning strategy for backward compatibility',
    status: 'pending',
    priority: 'medium',
    dueDate: new Date('2025-01-10'),
  },
];

export async function seedTodos() {
  console.log('🌱 Seeding todos...');

  // Clear existing todos
  await prisma.todo.deleteMany({});
  console.log('   Cleared existing todos');

  // Create todos
  let created = 0;
  for (const todo of todoSeedData) {
    await prisma.todo.create({
      data: todo,
    });
    created++;
  }

  console.log(`   ✅ Created ${created} todos`);
  console.log('   📊 Breakdown:');

  const statusCounts = await prisma.todo.groupBy({
    by: ['status'],
    _count: true,
  });

  statusCounts.forEach((group) => {
    console.log(`      - ${group.status}: ${group._count} todos`);
  });

  const priorityCounts = await prisma.todo.groupBy({
    by: ['priority'],
    _count: true,
  });

  console.log('   🎯 Priority breakdown:');
  priorityCounts.forEach((group) => {
    console.log(`      - ${group.priority}: ${group._count} todos`);
  });
}

export default seedTodos;
