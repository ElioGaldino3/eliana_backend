import { ProductOrder } from "../product.order.entity"
import { IsNotEmpty } from "class-validator"

export class CreateOrderDto {
  @IsNotEmpty()
  dateDelivery: string
  comment: string
  clientId: number
  products: ProductOrder[]
  isRent: boolean
}