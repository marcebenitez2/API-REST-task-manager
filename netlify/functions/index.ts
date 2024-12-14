import { Handler } from '@netlify/functions';
import { handler as serverlessHandler } from '../../dist/index';

export const handler: Handler = async (event, context) => {
  return await serverlessHandler(event, context);
};