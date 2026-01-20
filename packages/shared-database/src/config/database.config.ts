import { DataSourceOptions } from 'typeorm';

export interface DatabaseConfig {
  type: 'postgres';
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  entities: string[];
  migrations: string[];
  synchronize: boolean;
  logging: boolean;
}

export const createDatabaseConfig = (
  serviceName: string,
  entitiesPath: string,
  migrationsPath: string,
): DataSourceOptions => ({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || `juris_${serviceName}_db`,
  entities: [entitiesPath],
  migrations: [migrationsPath],
  synchronize: false,
  logging: process.env.NODE_ENV !== 'production',
});
