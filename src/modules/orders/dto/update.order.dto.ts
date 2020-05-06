import { ProductOrder } from "../product.order.entity"

export class UpdateOrderDto {
  id:number
  dateDelivery: string
  comment: string
  clientId: number
  products: ProductOrder[]
}