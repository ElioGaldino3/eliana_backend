import { ProductOrder } from '../product.order.entity';

export class UpdateOrderDto {
  dateDelivery: string;
  comment: string;
  clientId: number;
  products: ProductOrder[];
  isRent: boolean;
}
