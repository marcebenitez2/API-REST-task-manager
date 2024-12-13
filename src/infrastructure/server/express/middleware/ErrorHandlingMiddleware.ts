import { Request, Response, NextFunction } from 'express';
import winston from 'winston';

class CustomError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

const errorHandlingMiddleware = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  const logger =
    winston.createLogger(/* configuración similar a la del index */);

  logger.error(`Error: ${err.message}`, {
    method: req.method,
    path: req.path,
    body: req.body,
  });

  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message: err.message,
  });
};

export { CustomError, errorHandlingMiddleware };
export default errorHandlingMiddleware;
