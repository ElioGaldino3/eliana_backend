import { Module } from '@nestjs/common';
import { ClientsController } from './clients.controller';
import { ClientsService } from './clients.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientRepository } from './client.repository';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [ClientsController],
  providers: [ClientsService],
  imports: [
    TypeOrmModule.forFeature([ClientRepository]),
    AuthModule
  ]
})
export class ClientsModule { }
