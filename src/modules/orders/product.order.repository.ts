import { Repository, EntityRepository } from "typeorm";
import { ProductOrder } from "./product.order.entity";

@EntityRepository(ProductOrder)
export class ProductOrderRepository extends Repository<ProductOrder> {
  
}