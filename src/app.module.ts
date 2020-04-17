import { Module } from '@nestjs/common'
import { ClientsModule } from './clients/clients.module'
import { TypeOrmModule } from "@nestjs/typeorm"
import { typeOrmConfig } from './config/typeorm.config'
import { ProductsModule } from './products/products.module';
@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    ClientsModule,
    ProductsModule,
  ],
  providers: [],
})
export class AppModule { }
