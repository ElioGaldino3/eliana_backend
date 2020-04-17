import { Module } from '@nestjs/common'
import { ClientsModule } from './clients/clients.module'
import { TypeOrmModule } from "@nestjs/typeorm"
import { typeOrmConfig } from './config/typeorm.config'
@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    ClientsModule,
  ],
})
export class AppModule { }
