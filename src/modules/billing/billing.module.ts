import { Module } from '@nestjs/common';
import { BillingController } from './billing.controller';
import { BillingService } from './billing.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { BillingRepository } from './billing.repository';

@Module({
  controllers: [BillingController],
  providers: [BillingService],
  imports: [
    TypeOrmModule.forFeature([BillingRepository]),
    AuthModule
  ]
})
export class BillingModule {}
