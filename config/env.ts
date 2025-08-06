import { config } from 'dotenv'

config({path: `.env.${process.env.NODE_ENV || 'development'}.local` })

const requiredEnv = ['PORT', 
                     'NODE_ENV', 
                     'DB_URI', 
                     'JWT_SECRET', 
                     'ARCJET_ENV', 
                     'ARCJET_KEY', 
                     'QSTASH_TOKEN', 
                     'QSTASH_URL'] as const;

for (const key of requiredEnv) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

export const PORT = process.env.PORT as string;
export const NODE_ENV = process.env.NODE_ENV as string;
export const DB_URI = process.env.DB_URI as string;
export const JWT_SECRET = process.env.JWT_SECRET as string;
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';
export const ARCJET_ENV = process.env.ARCJET_ENV as string;
export const ARCJET_KEY = process.env.ARCJET_KEY as string;
export const QSTASH_TOKEN = process.env.QSTASH_TOKEN as string;
export const QSTASH_URL = process.env.QSTASH_URL as string;