import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import '../bootstrap';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database:
    process.env.NODE_ENV === 'test'
      ? process.env.DATABASE_DB_TEST
      : process.env.DATABASE_DB,
  synchronize: true,
  dropSchema: process.env.NODE_ENV === 'test' ? true : false,
  entities: ['dist/**/*.entity.js'],
};
