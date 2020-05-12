import { Controller, Get, Param, ParseIntPipe, Post, Body, Patch, Delete, UseGuards, UsePipes } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Order } from './order.entity';
import { CreateOrderDto } from './dto/create.order.dto';
import { UpdateOrderDto } from './dto/update.order.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('orders')
@UseGuards(AuthGuard())
export class OrdersController {
  constructor(private ordersService: OrdersService) { }

  @Get()
  async getOrders(): Promise<Order[]> {
    return await this.ordersService.getOrders()
  }

  @Get('/:id')
  async getProductById(@Param('id', ParseIntPipe) id: number): Promise<Order> {
    return await this.ordersService.getOrderById(id)
  }

  @Post()
  async createOrder(@Body() createOrderDto: CreateOrderDto): Promise<Order> {
    return await this.ordersService.createOrder(createOrderDto)
  }
  
  @Patch('/:id')
  async deliverOrder(@Param('id', ParseIntPipe) id: number): Promise<Order> {
    return await this.ordersService.deliverOrder(id)
  }

  @Patch()
  async updateOrder(@Body() updateOrderDto: UpdateOrderDto): Promise<Order> {
    return await this.ordersService.updateOrder(updateOrderDto)
  }


  @Delete('/:id')
  async deleteOrder(@Param('id') id: number) {
    await this.ordersService.deleteOrder(id)
  }
}
