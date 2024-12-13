import express, { Application } from 'express';
import mongoose from 'mongoose';
import swaggerUi from 'swagger-ui-express';
import compression from 'compression';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import winston from 'winston';

// Configuraciones
import { env } from './config/environment';
import swaggerDocument from './config/swagger';

// Rutas


// Middlewares
import errorHandlingMiddleware from './infrastructure/server/express/middleware/ErrorHandlingMiddleware';

const configureLogger = (): winston.Logger => {
  return winston.createLogger({
    level: 'info',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
    transports: [
      new winston.transports.Console(),
      new winston.transports.File({ filename: 'error.log', level: 'error' }),
      new winston.transports.File({ filename: 'combined.log' }),
    ],
  });
};

const initializeMiddlewares = (app: Application): void => {
  // Middlewares de seguridad y rendimiento
  app.use(helmet());
  app.use(compression());

  // Rate limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // Limitar cada IP a 100 solicitudes por ventana
  });
  app.use(limiter);

  // Parsers
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
};

const connectToDatabase = (logger: winston.Logger): Promise<void> => {
  return mongoose
    .connect(env.MONGODB_URI)
    .then(() => {
      logger.info('Conectado a MongoDB');
    })
    .catch((error) => {
      logger.error('Error conectando a MongoDB', error);
      process.exit(1);
    });
};

const initializeRoutes = (app: Application): void => {

};

const setupSwagger = (app: Application): void => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
};

const initializeErrorHandling = (app: Application): void => {
  app.use(errorHandlingMiddleware);
};

const createApp = (): { app: Application; logger: winston.Logger } => {
  const app = express();
  const logger = configureLogger();

  initializeMiddlewares(app);

  connectToDatabase(logger);

  initializeRoutes(app);
  setupSwagger(app);
  initializeErrorHandling(app);

  return { app, logger };
};

const startServer = (app: Application, logger: winston.Logger): void => {
  const port = env.PORT || 3000;
  app.listen(port, () => {
    logger.info(`Servidor corriendo en puerto ${port}`);
  });
};



// Crear instancia de la aplicación
const { app, logger } = createApp();

// Iniciar servidor solo si no estamos en modo test
if (process.env.NODE_ENV !== 'test') {
  startServer(app, logger);
}

export default app;
