import { Todo, Prisma } from '@prisma/client';
import { db } from '../config/database.config';
import { CreateTodoDto, UpdateTodoDto, GetTodosQuery } from '../types/todo.types';

export class TodoRepository {
  async create(data: CreateTodoDto): Promise<Todo> {
    return db.todo.create({
      data: {
        title: data.title,
        description: data.description,
        status: data.status,
        priority: data.priority,
        dueDate: data.dueDate,
      },
    });
  }

  async findById(id: string): Promise<Todo | null> {
    return db.todo.findUnique({
      where: { id },
    });
  }

  async findAll(query: GetTodosQuery): Promise<{ todos: Todo[]; total: number }> {
    const {
      page = 1,
      limit = 10,
      status,
      priority,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query;

    const skip = (page - 1) * limit;

    // Build where clause
    const where: Prisma.TodoWhereInput = {};
    if (status) where.status = status;
    if (priority) where.priority = priority;

    // Build orderBy clause
    const orderBy: Prisma.TodoOrderByWithRelationInput = {
      [sortBy]: sortOrder,
    };

    // Execute queries in parallel
    const [todos, total] = await Promise.all([
      db.todo.findMany({
        where,
        orderBy,
        skip,
        take: limit,
      }),
      db.todo.count({ where }),
    ]);

    return { todos, total };
  }

  async update(id: string, data: UpdateTodoDto): Promise<Todo> {
    return db.todo.update({
      where: { id },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.status !== undefined && { status: data.status }),
        ...(data.priority !== undefined && { priority: data.priority }),
        ...(data.dueDate !== undefined && { dueDate: data.dueDate }),
      },
    });
  }

  async delete(id: string): Promise<Todo> {
    return db.todo.delete({
      where: { id },
    });
  }

  async exists(id: string): Promise<boolean> {
    const count = await db.todo.count({
      where: { id },
    });
    return count > 0;
  }
}

export const todoRepository = new TodoRepository();
