import { Request, Response } from 'express';
import { todoService } from '../services/todo.service';
import { CreateTodoDto, UpdateTodoDto, GetTodosQuery } from '../types/todo.types';

export class TodoController {
  /**
   * @swagger
   * /api/todos:
   *   post:
   *     summary: Create a new todo
   *     tags: [Todos]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - title
   *             properties:
   *               title:
   *                 type: string
   *                 maxLength: 100
   *               description:
   *                 type: string
   *                 maxLength: 500
   *               status:
   *                 type: string
   *                 enum: [pending, in_progress, completed]
   *               priority:
   *                 type: string
   *                 enum: [low, medium, high]
   *               dueDate:
   *                 type: string
   *                 format: date-time
   *     responses:
   *       201:
   *         description: Todo created successfully
   *       422:
   *         description: Validation error
   */
  async createTodo(req: Request, res: Response): Promise<void> {
    const data: CreateTodoDto = req.body;
    const todo = await todoService.createTodo(data);

    res.status(201).json({
      success: true,
      message: 'Todo created successfully',
      data: todo,
    });
  }

  /**
   * @swagger
   * /api/todos/{id}:
   *   get:
   *     summary: Get todo by ID
   *     tags: [Todos]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *     responses:
   *       200:
   *         description: Todo retrieved successfully
   *       404:
   *         description: Todo not found
   */
  async getTodoById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const todo = await todoService.getTodoById(id);

    res.status(200).json({
      success: true,
      message: 'Todo retrieved successfully',
      data: todo,
    });
  }

  /**
   * @swagger
   * /api/todos:
   *   get:
   *     summary: Get all todos with pagination and filtering
   *     tags: [Todos]
   *     parameters:
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           minimum: 1
   *           default: 1
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           minimum: 1
   *           maximum: 100
   *           default: 10
   *       - in: query
   *         name: status
   *         schema:
   *           type: string
   *           enum: [pending, in_progress, completed]
   *       - in: query
   *         name: priority
   *         schema:
   *           type: string
   *           enum: [low, medium, high]
   *       - in: query
   *         name: sortBy
   *         schema:
   *           type: string
   *           enum: [createdAt, updatedAt, dueDate, title, priority]
   *           default: createdAt
   *       - in: query
   *         name: sortOrder
   *         schema:
   *           type: string
   *           enum: [asc, desc]
   *           default: desc
   *     responses:
   *       200:
   *         description: Todos retrieved successfully
   */
  async getAllTodos(req: Request, res: Response): Promise<void> {
    const query: GetTodosQuery = req.query;
    const { todos, meta } = await todoService.getAllTodos(query);

    res.status(200).json({
      success: true,
      message: 'Todos retrieved successfully',
      data: todos,
      meta,
    });
  }

  /**
   * @swagger
   * /api/todos/{id}:
   *   put:
   *     summary: Update todo by ID
   *     tags: [Todos]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               title:
   *                 type: string
   *                 maxLength: 100
   *               description:
   *                 type: string
   *                 maxLength: 500
   *               status:
   *                 type: string
   *                 enum: [pending, in_progress, completed]
   *               priority:
   *                 type: string
   *                 enum: [low, medium, high]
   *               dueDate:
   *                 type: string
   *                 format: date-time
   *     responses:
   *       200:
   *         description: Todo updated successfully
   *       404:
   *         description: Todo not found
   *       422:
   *         description: Validation error
   */
  async updateTodo(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const data: UpdateTodoDto = req.body;
    const todo = await todoService.updateTodo(id, data);

    res.status(200).json({
      success: true,
      message: 'Todo updated successfully',
      data: todo,
    });
  }

  /**
   * @swagger
   * /api/todos/{id}:
   *   delete:
   *     summary: Delete todo by ID
   *     tags: [Todos]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *     responses:
   *       200:
   *         description: Todo deleted successfully
   *       404:
   *         description: Todo not found
   */
  async deleteTodo(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    await todoService.deleteTodo(id);

    res.status(200).json({
      success: true,
      message: 'Todo deleted successfully',
    });
  }
}

export const todoController = new TodoController();
