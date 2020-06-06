import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { OrderRepository } from './order.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductOrderRepository } from './product.order.repository';
import { AuthModule } from '../auth/auth.module';
import { OrdersPdfService } from './orders.pdf.service';

@Module({
  providers: [OrdersService, OrdersPdfService],
  controllers: [OrdersController],
  imports: [TypeOrmModule.forFeature([OrderRepository, ProductOrderRepository]), AuthModule]
})
export class OrdersModule { }
