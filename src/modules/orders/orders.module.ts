import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { OrderRepository } from './order.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductOrderRepository } from './product.order.repository';
import { AuthModule } from '../auth/auth.module';
import { OrdersPdfService } from './orders.pdf.service';
import { Product } from '../products/product.entity';

@Module({
  providers: [OrdersService, OrdersPdfService],
  controllers: [OrdersController],
  imports: [TypeOrmModule.forFeature([OrderRepository, ProductOrderRepository, Product]), AuthModule]
})
export class OrdersModule { }
