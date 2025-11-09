import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { ValidationError } from '../utils/errors';

type ValidationSource = 'body' | 'query' | 'params';

export const validate = (schema: Joi.ObjectSchema, source: ValidationSource = 'body') => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req[source], {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));

      throw new ValidationError('Validation failed', errors);
    }

    // Replace the request data with validated and sanitized data
    req[source] = value;
    next();
  };
};
