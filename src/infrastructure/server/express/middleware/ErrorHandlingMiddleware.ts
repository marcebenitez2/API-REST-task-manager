import { Request, Response, NextFunction } from 'express';
import logger from '../../../../config/logger';

class CustomError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

const errorHandlingMiddleware = (
  err: CustomError | Error,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const statusCode = err instanceof CustomError ? err.statusCode : 500;

  logger.error({
    message: err.message,
    statusCode,
    method: req.method,
    path: req.originalUrl,
    body: req.body,
    stack: err.stack,
  });

  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message: err.message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
};

export { CustomError, errorHandlingMiddleware };
export default errorHandlingMiddleware;
