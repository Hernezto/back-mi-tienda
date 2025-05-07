// src/config/env.config.ts
interface DatabaseConfig {
  host: string;
  port: number;
  name: string;
  password: string;
  username: string;
}

interface JwtConfig {
  key: string;
  expiresIn: string;
}

export interface EnvConfig {
  environment: string;
  port: number;
  jwt: JwtConfig;
  database: DatabaseConfig;
}

export const envConfiguration = (): EnvConfig => ({
  environment: process.env.ENV || 'dev',
  port: parseInt(process.env.PORT || '3000', 10),
  jwt: {
    key: process.env.JWT_KEY || 'secretKey',
    expiresIn: process.env.JWT_EXPIRES_IN || '2h',
  },
  database: {
    host: process.env.BD_HOST || 'localhost',
    port: parseInt(process.env.BD_PORT || '5432', 10),
    name: process.env.BD_NAME || 'nestdb',
    password: process.env.BD_PASSWORD || 'postgres',
    username: process.env.BD_USERNAME || 'postgres',
  },
});