import { Request, Response, NextFunction } from 'express';
import { AppError } from '../types';

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('Error:', err);

  // Handle operational errors
  if (err instanceof Error && 'statusCode' in err && (err as AppError).isOperational) {
    const appError = err as AppError;
    res.status(appError.statusCode || 500).json({
      error: 'Operational error',
      message: appError.message
    });
    return;
  }

  // Handle validation errors
  if (err.message.includes('Validation error')) {
    res.status(400).json({
      error: 'Validation error',
      message: err.message
    });
    return;
  }

  // Handle other known errors
  if (err.message.includes('not found')) {
    res.status(404).json({
      error: 'Not found',
      message: err.message
    });
    return;
  }

  // Default error response
  res.status(500).json({
    error: 'Internal server error',
    message: process.env['NODE_ENV'] === 'development' ? err.message : 'Something went wrong'
  });
}; 