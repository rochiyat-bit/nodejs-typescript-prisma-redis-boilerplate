import Joi from 'joi';

export const createTodoSchema = Joi.object({
  title: Joi.string().max(100).required().messages({
    'string.empty': 'Title is required',
    'string.max': 'Title must not exceed 100 characters',
    'any.required': 'Title is required',
  }),
  description: Joi.string().max(500).optional().allow('').messages({
    'string.max': 'Description must not exceed 500 characters',
  }),
  status: Joi.string()
    .valid('pending', 'in_progress', 'completed')
    .optional()
    .messages({
      'any.only': 'Status must be one of: pending, in_progress, completed',
    }),
  priority: Joi.string().valid('low', 'medium', 'high').optional().messages({
    'any.only': 'Priority must be one of: low, medium, high',
  }),
  dueDate: Joi.date().iso().optional().allow(null).messages({
    'date.format': 'Due date must be a valid ISO 8601 date',
  }),
});

export const updateTodoSchema = Joi.object({
  title: Joi.string().max(100).optional().messages({
    'string.empty': 'Title cannot be empty',
    'string.max': 'Title must not exceed 100 characters',
  }),
  description: Joi.string().max(500).optional().allow('').messages({
    'string.max': 'Description must not exceed 500 characters',
  }),
  status: Joi.string()
    .valid('pending', 'in_progress', 'completed')
    .optional()
    .messages({
      'any.only': 'Status must be one of: pending, in_progress, completed',
    }),
  priority: Joi.string().valid('low', 'medium', 'high').optional().messages({
    'any.only': 'Priority must be one of: low, medium, high',
  }),
  dueDate: Joi.date().iso().optional().allow(null).messages({
    'date.format': 'Due date must be a valid ISO 8601 date',
  }),
}).min(1);

export const getTodosQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).optional().default(1).messages({
    'number.base': 'Page must be a number',
    'number.min': 'Page must be at least 1',
  }),
  limit: Joi.number().integer().min(1).max(100).optional().default(10).messages({
    'number.base': 'Limit must be a number',
    'number.min': 'Limit must be at least 1',
    'number.max': 'Limit must not exceed 100',
  }),
  status: Joi.string()
    .valid('pending', 'in_progress', 'completed')
    .optional()
    .messages({
      'any.only': 'Status must be one of: pending, in_progress, completed',
    }),
  priority: Joi.string().valid('low', 'medium', 'high').optional().messages({
    'any.only': 'Priority must be one of: low, medium, high',
  }),
  sortBy: Joi.string()
    .valid('createdAt', 'updatedAt', 'dueDate', 'title', 'priority')
    .optional()
    .default('createdAt')
    .messages({
      'any.only':
        'Sort by must be one of: createdAt, updatedAt, dueDate, title, priority',
    }),
  sortOrder: Joi.string().valid('asc', 'desc').optional().default('desc').messages({
    'any.only': 'Sort order must be either asc or desc',
  }),
});

export const todoIdSchema = Joi.object({
  id: Joi.string().uuid().required().messages({
    'string.empty': 'Todo ID is required',
    'string.guid': 'Todo ID must be a valid UUID',
    'any.required': 'Todo ID is required',
  }),
});
