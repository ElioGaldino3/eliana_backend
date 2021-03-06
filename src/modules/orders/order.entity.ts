import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm'
import { ProductOrder } from './product.order.entity';
import { Client } from '../clients/client.entity';

@Entity()
export class Order extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => Client, client => client.orders)
  client: Client;

  @Column({ type: 'timestamptz', default: () => 'now()' })
  dateDelivery: string

  @Column({ default: () => 'false' })
  isDelivery: boolean

  @Column({ nullable: true })
  comment: string

  @OneToMany(() => ProductOrder, productOrder => productOrder.order)
  @JoinColumn()
  products: ProductOrder[];

  @Column({select: false})
  clientId: number

  @Column()
  isRent: boolean

}