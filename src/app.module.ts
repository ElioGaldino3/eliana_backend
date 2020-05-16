import { Module } from '@nestjs/common'
import { ClientsModule } from './modules/clients/clients.module'
import { TypeOrmModule } from "@nestjs/typeorm"
import { typeOrmConfig } from './config/typeorm.config'
import { ProductsModule } from './modules/products/products.module';
import { OrdersModule } from './modules/orders/orders.module';
import { AuthModule } from './modules/auth/auth.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { BillingModule } from './modules/billing/billing.module';

@Module({
  imports: [
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
