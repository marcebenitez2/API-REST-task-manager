import express, { Application } from 'express';
import mongoose from 'mongoose';
import swaggerUi from 'swagger-ui-express';
import compression from 'compression';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import logger from './config/logger';

// Configuraciones
import { env } from './config/environment';
import { swaggerDocument } from './config/swagger';

// Rutas
import userRoutes from './infrastructure/server/express/routes/UserRoutes';
import projectRoutes from './infrastructure/server/express/routes/ProjectRoutes';
import taskRoutes from './infrastructure/server/express/routes/TaskRoutes';

// Middlewares
import errorHandlingMiddleware from './infrastructure/server/express/middleware/ErrorHandlingMiddleware';

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

const connectToDatabase = (): Promise<void> => {
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
  app.use('/api/users', userRoutes);
  app.use('/api/projects', projectRoutes);
  app.use('/api/tasks', taskRoutes);
};

const setupSwagger = (app: Application): void => {
  try {
    app.use(
      '/api-docs',
      swaggerUi.serve,
      swaggerUi.setup(swaggerDocument, {
        explorer: true,
      })
    );
    console.log('Swagger UI initialized successfully');
  } catch (error) {
    console.error('Error initializing Swagger UI:', error);
  }
};

const initializeErrorHandling = (app: Application): void => {
  app.use(errorHandlingMiddleware);
};

// Crear instancia de la aplicación
const createApp = (): { app: Application } => {
  const app = express();

  initializeMiddlewares(app);
  connectToDatabase();
  initializeRoutes(app);
  setupSwagger(app);
  initializeErrorHandling(app);

  return { app };
};

const startServer = (app: Application): void => {
  const port = env.PORT || 3000;
  app.listen(port, () => {
    logger.info(`Servidor corriendo en puerto ${port}`);
  });
};

const { app } = createApp();
if (process.env.NODE_ENV !== 'test') {
  startServer(app);
}

export default app;
