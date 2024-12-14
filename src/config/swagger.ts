import swaggerJSDoc from 'swagger-jsdoc';
import path from 'path';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Task Manager API',
      version: '1.0.0',
      description: 'API for task and project management',
    },
    servers: [
      {
        url: process.env.SWAGGER_SERVER_URL || 'http://localhost:3000/api',
        description: process.env.NODE_ENV === 'production'
          ? 'Production server'
          : 'Local development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: { 
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT', 
        },
      },
    },
    security: [
      {
        bearerAuth: [], // Aplica la seguridad globalmente
      },
    ],
  },
  apis: [
    path.resolve(__dirname, '../infrastructure/server/express/routes/*.ts'),
  ],
};

export const swaggerDocument = swaggerJSDoc(options);
