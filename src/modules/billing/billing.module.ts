import { Module } from '@nestjs/common';
import { BillingController } from './billing.controller';
import { BillingService } from './billing.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { Billing } from './billing.entity';

@Module({
  controllers: [BillingController],
  providers: [BillingService],
  imports: [AuthModule,TypeOrmModule.forFeature([Billing])],
})
export class BillingModule {}
