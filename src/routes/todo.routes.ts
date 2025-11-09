import { Router } from 'express';
import { todoController } from '../controllers/todo.controller';
import { asyncHandler } from '../middlewares/asyncHandler.middleware';
import { validate } from '../middlewares/validation.middleware';
import {
  createTodoSchema,
  updateTodoSchema,
  getTodosQuerySchema,
  todoIdSchema,
} from '../validators/todo.validator';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Todos
 *   description: Todo management endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Todo:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         status:
 *           type: string
 *           enum: [pending, in_progress, completed]
 *         priority:
 *           type: string
 *           enum: [low, medium, high]
 *         dueDate:
 *           type: string
 *           format: date-time
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

// Create todo
router.post(
  '/',
  validate(createTodoSchema, 'body'),
  asyncHandler(todoController.createTodo.bind(todoController))
);

// Get all todos
router.get(
  '/',
  validate(getTodosQuerySchema, 'query'),
  asyncHandler(todoController.getAllTodos.bind(todoController))
);

// Get todo by ID
router.get(
  '/:id',
  validate(todoIdSchema, 'params'),
  asyncHandler(todoController.getTodoById.bind(todoController))
);

// Update todo
router.put(
  '/:id',
  validate(todoIdSchema, 'params'),
  validate(updateTodoSchema, 'body'),
  asyncHandler(todoController.updateTodo.bind(todoController))
);

// Delete todo
router.delete(
  '/:id',
  validate(todoIdSchema, 'params'),
  asyncHandler(todoController.deleteTodo.bind(todoController))
);

export default router;
