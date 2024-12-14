import { Handler } from '@netlify/functions';
import { handler as serverlessHandler } from '../../dist/index';

export const handler: Handler = async (event, context) => {
  try {
    console.log('Netlify Function - Evento recibido:', {
      method: event.httpMethod,
      path: event.path,
      body: event.body,
      headers: event.headers
    });

    const result = await serverlessHandler(event, context);
    
    console.log('Resultado del handler:', result);
    return result;
  } catch (error) {
    console.error('Error en Netlify Function:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Error interno del servidor',
        error: error instanceof Error ? error.message : 'Error desconocido'
      })
    };
  }
};