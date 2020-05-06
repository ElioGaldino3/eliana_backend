import { Order } from 'src/modules/orders/order.entity';
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from 'src/modules/products/product.entity';

@Entity()
export class ProductOrder extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number

  @Column()
  amount: number

  @ManyToOne(() => Order, order => order.products)
  order: Order

  @ManyToOne(() => Product, product => product.productOrder)
  product: Product

  @Column()
  productId: number

  @Column()
  orderId: number
}