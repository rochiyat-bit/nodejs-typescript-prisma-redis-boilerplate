import { Request, Response, NextFunction } from 'express';
import { AppError, ValidationError } from '../utils/errors';
import { logger } from '../config/logger.config';
import { Prisma } from '@prisma/client';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  // Log error
  logger.error(`Error: ${err.message}`, {
    error: err,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  // Handle AppError (custom errors)
  if (err instanceof ValidationError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors,
    });
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  // Handle Prisma errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    return handlePrismaError(err, res);
  }

  if (err instanceof Prisma.PrismaClientValidationError) {
    return res.status(400).json({
      success: false,
      message: 'Database validation error',
    });
  }

  // Handle Joi validation errors
  if (err.name === 'ValidationError') {
    return res.status(422).json({
      success: false,
      message: 'Validation Error',
      errors: err.message,
    });
  }

  // Default error
  const statusCode = 500;
  const message =
    process.env.NODE_ENV === 'production'
      ? 'Internal Server Error'
      : err.message;

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
};

const handlePrismaError = (
  err: Prisma.PrismaClientKnownRequestError,
  res: Response
) => {
  switch (err.code) {
    case 'P2002':
      // Unique constraint violation
      return res.status(409).json({
        success: false,
        message: 'A record with this value already exists',
      });
    case 'P2025':
      // Record not found
      return res.status(404).json({
        success: false,
        message: 'Record not found',
      });
    case 'P2003':
      // Foreign key constraint violation
      return res.status(400).json({
        success: false,
        message: 'Invalid reference to related record',
      });
    default:
      return res.status(400).json({
        success: false,
        message: 'Database operation failed',
      });
  }
};

export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
};
