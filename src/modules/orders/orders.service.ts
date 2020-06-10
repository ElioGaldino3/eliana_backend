import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Order } from './order.entity';
import { CreateOrderDto } from './dto/create.order.dto';
import { UpdateOrderDto } from './dto/update.order.dto';
import { ProductOrder } from './product.order.entity';
import { getConnection, getRepository } from 'typeorm';
import { Product } from '../products/product.entity';

@Injectable()
export class OrdersService {
  async getOrders(): Promise<Order[]> {
    const orders = await getConnection()
      .getRepository(Order)
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.products', 'product_order')
      .leftJoinAndSelect('order.client', 'client')
      .leftJoinAndSelect('product_order.product', 'product')
      .orderBy('order.dateDelivery', 'ASC')
      .where('order.isDelivery = :isDelivery', { isDelivery: false })
      .getMany();

    return orders;
  }

  async getOrderById(id: number): Promise<Order> {
    const found = await getConnection()
      .getRepository(Order)
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.products', 'product_order')
      .leftJoinAndSelect('order.client', 'client')
      .leftJoinAndSelect('product_order.product', 'product')
      .where('order.isDelivery = :isDelivery', { isDelivery: false })
      .andWhere('order.id = :id', { id: id })
      .getOne();

    if (!found) {
      throw new NotFoundException(
        'Order com o id "' + id + '" não foi encontrado',
      );
    }

    return found;
  }

  async createOrder(createOrderDto: CreateOrderDto): Promise<Order> {
    const order = new Order();
    const {
      dateDelivery,
      products,
      clientId,
      comment,
      isRent,
    } = createOrderDto;

    order.dateDelivery = dateDelivery;
    order.products = products;
    order.clientId = clientId;
    order.comment = comment;
    order.isRent = isRent === 'true';

    let productNotFound = false;
    const productRepo = getRepository(Product);

    for (let index = 0; index < products.length; index++) {
      const p = products[index];
      const product = await productRepo.findOne({ where: { id: p.productId } });
      if (!product) {
        productNotFound = true;
      }
    }
    if (!productNotFound) {
      await order.save();

      for (let index = 0; index < products.length; index++) {
        const p = products[index];

        const productOrder = new ProductOrder();
        productOrder.orderId = order.id;
        productOrder.productId = p.productId;
        productOrder.amount = p.amount;

        await productOrder.save();
      }

      return order;
    } else {
      throw new BadRequestException('Product Order Not Found');
    }
  }

  async deleteOrder(id: number): Promise<void> {
    const order = await this.getOrderById(id);
    order.client = null;
    const products = await (getRepository(ProductOrder)).find();
    for (let index = 0; index < products.length; index++) {
      const p = products[index];
      await p.remove();
    }
    order.products = null;
    await order.remove();
  }

  async deliverOrder(id: number): Promise<Order> {
    const order = await this.getOrderById(id);
    order.isDelivery = true;
    await order.save();

    return order;
  }

  async updateOrder(
    id: number,
    updateOrderDto: UpdateOrderDto,
  ): Promise<Order> {
    const order = await this.getOrderById(id);

    order.dateDelivery = updateOrderDto.dateDelivery || order.dateDelivery;

    order.clientId = updateOrderDto.clientId || order.client.id;

    order.comment = updateOrderDto.comment || order.comment;

    order.isRent = updateOrderDto.isRent || order.isRent;

    let productNotFound = false;
    const productRepo = getRepository(Product);

    for (let index = 0; index < updateOrderDto.products.length; index++) {
      const p = updateOrderDto.products[index];
      const product = await productRepo.findOne({ where: { id: p.productId } });
      if (!product) {
        productNotFound = true;
      }
    }

    if (!productNotFound) {
      const productOrderRepo = getRepository(ProductOrder);
      const productsOrder = await productOrderRepo.find({
        where: { orderId: id },
      });
      for (let index = 0; index < productsOrder.length; index++) {
        const p = productsOrder[index];

        p.remove();
      }
      for (let index = 0; index < updateOrderDto.products.length; index++) {
        const p = updateOrderDto.products[index];

        const productOrder = new ProductOrder();
        productOrder.orderId = order.id;
        productOrder.productId = p.productId;
        productOrder.amount = p.amount;

        await productOrder.save();
      }

      await getConnection()
        .createQueryBuilder()
        .update(Order)
        .set({
          dateDelivery: order.dateDelivery,
          clientId: order.clientId,
          comment: order.comment,
          isRent: order.isRent,
        })
        .where('id = :id', { id: order.id })
        .execute();

      order.products = updateOrderDto.products;
      order.clientId = null;
      return order;
    } else {
      throw new BadRequestException('Product Not Found');
    }
  }
}
