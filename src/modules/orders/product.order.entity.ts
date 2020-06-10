import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from '../products/product.entity';
import { Order } from './order.entity';

@Entity()
export class ProductOrder extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  amount: number;

  @ManyToOne(
    () => Order,
    order => order.products,
  )
  order: Order;

  @ManyToOne(
    () => Product,
    product => product.productOrder,
  )
  product: Product;

  @Column()
  productId: number;

  @Column()
  orderId: number;
}
