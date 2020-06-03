import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export const typeOrmConfigTest: TypeOrmModuleOptions = {
    type: 'postgres',
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT),
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_DB_TEST,
    synchronize: true,
    dropSchema: true,
    entities: ['dist/**/*.entity.js'],
  };
  