import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Task Management API',
      version: '1.0.0',
      description: 'API for task and project management',
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
      },
    ],
  },
  apis: ['../infrastructure/server/express/routes/*.ts'], // Rutas a tus archivos
};

export const swaggerDocument = swaggerJSDoc(options);
