import { Todo } from '@prisma/client';
import { todoRepository } from '../repositories/todo.repository';
import {
  CreateTodoDto,
  UpdateTodoDto,
  GetTodosQuery,
  PaginationMeta,
} from '../types/todo.types';
import { NotFoundError } from '../utils/errors';
import { cacheGet, cacheSet, cacheDel, cacheDelPattern } from '../config/redis.config';
import { logger } from '../config/logger.config';

export class TodoService {
  private readonly CACHE_PREFIX = 'todos';
  private readonly CACHE_TTL = 300; // 5 minutes

  private getCacheKey(id: string): string {
    return `${this.CACHE_PREFIX}:${id}`;
  }

  private getListCacheKey(query: GetTodosQuery): string {
    const queryString = JSON.stringify(query);
    return `${this.CACHE_PREFIX}:list:${Buffer.from(queryString).toString('base64')}`;
  }

  async createTodo(data: CreateTodoDto): Promise<Todo> {
    const todo = await todoRepository.create(data);

    // Invalidate list cache
    await this.invalidateListCache();

    logger.info(`Todo created: ${todo.id}`);
    return todo;
  }

  async getTodoById(id: string): Promise<Todo> {
    // Try to get from cache
    const cacheKey = this.getCacheKey(id);
    const cached = await cacheGet(cacheKey);

    if (cached) {
      logger.debug(`Cache hit for todo: ${id}`);
      return JSON.parse(cached);
    }

    // Get from database
    const todo = await todoRepository.findById(id);
    if (!todo) {
      throw new NotFoundError('Todo not found');
    }

    // Store in cache
    await cacheSet(cacheKey, JSON.stringify(todo), this.CACHE_TTL);
    logger.debug(`Cache miss for todo: ${id}, cached now`);

    return todo;
  }

  async getAllTodos(
    query: GetTodosQuery
  ): Promise<{ todos: Todo[]; meta: PaginationMeta }> {
    // Try to get from cache
    const cacheKey = this.getListCacheKey(query);
    const cached = await cacheGet(cacheKey);

    if (cached) {
      logger.debug('Cache hit for todos list');
      return JSON.parse(cached);
    }

    // Get from database
    const { todos, total } = await todoRepository.findAll(query);

    const page = query.page || 1;
    const limit = query.limit || 10;
    const totalPages = Math.ceil(total / limit);

    const result = {
      todos,
      meta: {
        page,
        limit,
        total,
        totalPages,
      },
    };

    // Store in cache
    await cacheSet(cacheKey, JSON.stringify(result), this.CACHE_TTL);
    logger.debug('Cache miss for todos list, cached now');

    return result;
  }

  async updateTodo(id: string, data: UpdateTodoDto): Promise<Todo> {
    // Check if todo exists
    const exists = await todoRepository.exists(id);
    if (!exists) {
      throw new NotFoundError('Todo not found');
    }

    // Update todo
    const updatedTodo = await todoRepository.update(id, data);

    // Invalidate cache
    await this.invalidateTodoCache(id);
    await this.invalidateListCache();

    logger.info(`Todo updated: ${id}`);
    return updatedTodo;
  }

  async deleteTodo(id: string): Promise<void> {
    // Check if todo exists
    const exists = await todoRepository.exists(id);
    if (!exists) {
      throw new NotFoundError('Todo not found');
    }

    // Delete todo
    await todoRepository.delete(id);

    // Invalidate cache
    await this.invalidateTodoCache(id);
    await this.invalidateListCache();

    logger.info(`Todo deleted: ${id}`);
  }

  private async invalidateTodoCache(id: string): Promise<void> {
    const cacheKey = this.getCacheKey(id);
    await cacheDel(cacheKey);
    logger.debug(`Cache invalidated for todo: ${id}`);
  }

  private async invalidateListCache(): Promise<void> {
    await cacheDelPattern(`${this.CACHE_PREFIX}:list:*`);
    logger.debug('List cache invalidated');
  }
}

export const todoService = new TodoService();
