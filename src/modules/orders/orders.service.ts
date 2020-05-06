import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderRepository } from './order.repository';
import { Order } from './order.entity';
import { CreateOrderDto } from './dto/create.order.dto';
import { UpdateOrderDto } from './dto/update.order.dto';
import { ProductOrder } from './product.order.entity';

@Injectable()
export class OrdersService {

  constructor(
    @InjectRepository(OrderRepository)
    private orderRepository: OrderRepository,
  ) { }

  async getOrders(): Promise<Order[]> {
    const orders = await this.orderRepository.find({ relations: ["products"] })

    return orders
  }

  async getOrderById(id: number): Promise<Order> {
    const found = await this.orderRepository.findOne(id, { relations: ["products"] })


    if (!found) {
      throw new NotFoundException('Order com o id "' + id + '" não foi encontrado')
    }

    return found
  }

  async createOrder(createOrderDto: CreateOrderDto): Promise<Order> {
    const order = new Order()
    const { dateDelivery, products, clientId, comment } = createOrderDto

    order.dateDelivery = dateDelivery
    order.products = products
    order.clientId = clientId
    order.comment = comment

    await order.save()
    order.products = [];


    products.forEach(async p => {
      const productOrder = new ProductOrder()
      productOrder.orderId = order.id,
        productOrder.productId = p.productId
      productOrder.amount = p.amount

      await productOrder.save()

      order.products.push(productOrder)
    })

    return order
  }

  async deleteOrder(id: number): Promise<void> {
    const order = await this.getOrderById(id)

    await order.remove()
  }

  async updateOrder(updateOrderDto: UpdateOrderDto): Promise<Order> {
    const order = await this.getOrderById(updateOrderDto.id)

    if (updateOrderDto.dateDelivery) { order.dateDelivery = updateOrderDto.dateDelivery }
    if (updateOrderDto.products) { order.products = updateOrderDto.products }
    if (updateOrderDto.clientId) { order.clientId = updateOrderDto.clientId }
    if (updateOrderDto.comment) { order.comment = updateOrderDto.comment }

    await order.save()
    return order
  }
}
