import { Request, Response, NextFunction } from 'express';
import { Schema } from 'joi';
import { CustomError } from './ErrorHandlingMiddleware';

export const validateRequest = (schema: Schema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const errorDetails = error.details.map(detail => ({
        message: detail.message,
        path: detail.path
      }));

      throw new CustomError('Validation failed', 400);
    }

    next();
  };
};