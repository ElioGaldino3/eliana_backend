import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderRepository } from './order.repository';
import { Order } from './order.entity';
import { CreateOrderDto } from './dto/create.order.dto';
import { UpdateOrderDto } from './dto/update.order.dto';
import { ProductOrder } from './product.order.entity';
import { getConnection, getRepository } from 'typeorm';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(
    @InjectRepository(OrderRepository)
    private orderRepository: OrderRepository,
  ) { }

  async getOrders(): Promise<Order[]> {
    const orders = await getConnection()
      .getRepository(Order)
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.products', 'product_order')
      .leftJoinAndSelect('order.client', 'client')
      .leftJoinAndSelect('product_order.product', "product")
      .orderBy('order.dateDelivery', 'ASC')
      .where("order.isDelivery = :isDelivery", { isDelivery: false })
      .getMany()

    return orders
  }

  async getOrderById(id: number): Promise<Order> {
    const found = await getConnection()
      .getRepository(Order)
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.products', 'product_order')
      .leftJoinAndSelect('order.client', 'client')
      .leftJoinAndSelect('product_order.product', "product")
      .where("order.isDelivery = :isDelivery", { isDelivery: false })
      .andWhere("order.id = :id", { id: id })
      .getOne()


    if (!found) {
      throw new NotFoundException('Order com o id "' + id + '" não foi encontrado')
    }

    return found
  }

  async createOrder(createOrderDto: CreateOrderDto): Promise<Order> {
    const order = new Order()
    const { dateDelivery, products, clientId, comment, isRent } = createOrderDto

    order.dateDelivery = dateDelivery
    order.products = products
    order.clientId = clientId
    order.comment = comment
    order.isRent = isRent === "true"

    await order.save()

    products.forEach(async p => {
      const productOrder = new ProductOrder()
      productOrder.orderId = order.id,
        productOrder.productId = p.productId
      productOrder.amount = p.amount

      await productOrder.save()
    })
    return order
  }

  async deleteOrder(id: number): Promise<void> {
    const order = await this.getOrderById(id)
    order.client = null;

    order.products.forEach((e) => {
      const productOrder = new ProductOrder();

      productOrder.id = e.id

      productOrder.remove()
    })

    order.products = null;
    await order.remove()
  }

  async deliverOrder(id: number): Promise<Order> {
    const order = await this.getOrderById(id)
    order.isDelivery = true;
    await order.save()

    return order;
  }

  async updateOrder(updateOrderDto: UpdateOrderDto): Promise<Order> {
    const order = await this.getOrderById(updateOrderDto.id)

    if (updateOrderDto.dateDelivery) { order.dateDelivery = updateOrderDto.dateDelivery }
    if (updateOrderDto.clientId) { order.clientId = updateOrderDto.clientId }
    if (updateOrderDto.comment) { order.comment = updateOrderDto.comment }
    if (updateOrderDto.isRent) { order.isRent = updateOrderDto.isRent }

    updateOrderDto.products.forEach(async p => {

      const productOrderRepo = getRepository(ProductOrder);

      const findProduct = await productOrderRepo.findOne({
        where: { id: p.id }
      })
      console.log(findProduct)
      if (findProduct) {
        if (findProduct.amount != p.amount) {
          findProduct.amount = p.amount;

          await findProduct.save()
        }
      } else {
        const productOrder = new ProductOrder()
        productOrder.orderId = order.id
        productOrder.productId = p.productId
        productOrder.amount = p.amount

        await productOrder.save()
      }
    })

    await getConnection()
      .createQueryBuilder()
      .update(Order)
      .set({
        dateDelivery: order.dateDelivery,
        clientId: order.clientId,
        comment: order.comment,
        isRent: order.isRent
      })
      .where("id = :id", { id: order.id })
      .execute()

    order.products = updateOrderDto.products;
    order.clientId = null;
    return order
  }
}
