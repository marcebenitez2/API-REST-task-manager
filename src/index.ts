import express, { Application } from 'express';
import serverless from 'serverless-http';
import mongoose from 'mongoose';
import swaggerUi from 'swagger-ui-express';
import compression from 'compression';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import logger from './config/logger';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

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
  // CORS para Netlify
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();
  });

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
const createApp = (): Application => {
  const app = express();

  initializeMiddlewares(app);
  connectToDatabase();
  initializeRoutes(app);
  setupSwagger(app);
  initializeErrorHandling(app);

  return app;
};

// Crear la aplicación
const app = createApp();

// Crear handler de serverless de forma explícita
const serverlessHandler = serverless(app);

// Exportar handler de serverless
export { serverlessHandler as handler };

// Mantener el servidor local para desarrollo
if (process.env.NODE_ENV !== 'production') {
  const port = env.PORT || 3000;
  app.listen(port, () => {
    logger.info(`Servidor corriendo en puerto ${port}`);
  });
}

export default app;