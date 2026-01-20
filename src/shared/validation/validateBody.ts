import type { NextFunction, Request, Response } from 'express';
import type { ZodSchema } from 'zod';

export const validateBody =
  <T>(schema: ZodSchema<T>) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Validation failed',
          details: result.error.issues.map((issue) => ({
            field: issue.path.join('.') || 'body',
            message: issue.message
          }))
        },
        timestamp: new Date().toISOString()
      });
      return;
    }

    req.body = result.data;
    next();
  };

