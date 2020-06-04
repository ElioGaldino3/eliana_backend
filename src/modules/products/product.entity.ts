import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn } from 'typeorm'
import { ProductOrder } from '../orders/product.order.entity'

@Entity()
export class Product extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column({type: 'real'})
  value: string
  
  @Column({nullable: true})
  photoUrl: string

  @Column()
  isRent: boolean

  @OneToMany(() => ProductOrder, productOrder => productOrder.product)
  @JoinColumn()
  productOrder: ProductOrder[];

}