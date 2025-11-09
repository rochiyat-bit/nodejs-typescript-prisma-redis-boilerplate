import { TodoStatus, TodoPriority } from '@prisma/client';

export interface CreateTodoDto {
  title: string;
  description?: string;
  status?: TodoStatus;
  priority?: TodoPriority;
  dueDate?: Date;
}

export interface UpdateTodoDto {
  title?: string;
  description?: string;
  status?: TodoStatus;
  priority?: TodoPriority;
  dueDate?: Date | null;
}

export interface GetTodosQuery {
  page?: number;
  limit?: number;
  status?: TodoStatus;
  priority?: TodoPriority;
  sortBy?: 'createdAt' | 'updatedAt' | 'dueDate' | 'title' | 'priority';
  sortOrder?: 'asc' | 'desc';
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  meta?: PaginationMeta;
}

export interface ErrorResponse {
  success: false;
  message: string;
  errors?: any[];
}
