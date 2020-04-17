import { TypeOrmModuleOptions } from "@nestjs/typeorm"
import { Client } from "src/clients/client.entity"

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'eliana_user',
  password: '7k7k7k7k',
  database: 'eliana',
  entities: [Client],
  synchronize: true
}