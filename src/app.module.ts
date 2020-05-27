import { Module } from '@nestjs/common'
import { ClientsModule } from './modules/clients/clients.module'
import { TypeOrmModule } from "@nestjs/typeorm"
import { typeOrmConfig } from './config/typeorm.config'
import { ProductsModule } from './modules/products/products.module';
import { OrdersModule } from './modules/orders/orders.module';
import { AuthModule } from './modules/auth/auth.module';
import { BillingModule } from './modules/billing/billing.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot(typeOrmConfig),
    ClientsModule,
    ProductsModule,
    OrdersModule,
    AuthModule,
    BillingModule
  ],
  providers: [],
})
export class AppModule { }
