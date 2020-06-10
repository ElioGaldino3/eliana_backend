import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn } from 'typeorm'
import { Order } from '../orders/order.entity'


@Entity()
export class Client extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  phone: string

  @Column({ nullable: true })
  photoUrl: string

  @OneToMany(() => Order, order => order.client)
  @JoinColumn()
  orders: Order[];
}