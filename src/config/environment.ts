import dotenv from 'dotenv';

dotenv.config();

export const env = {
  MONGODB_URI: process.env.MONGODB_URI || '',
  PORT: process.env.PORT || 3000,
  JWT_SECRET: process.env.JWT_SECRET || '',
};
