import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Body,
  Patch,
  Delete,
  UseGuards,
  Res,
  Req,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Order } from './order.entity';
import { CreateOrderDto } from './dto/create.order.dto';
import { UpdateOrderDto } from './dto/update.order.dto';
import { AuthGuard } from '@nestjs/passport';
import { OrdersPdfService } from './orders.pdf.service';
import { Response, Request } from 'express';
import { join } from 'path';
import send = require('send');

@Controller('orders')
@UseGuards(AuthGuard())
export class OrdersController {
  constructor(
    private ordersService: OrdersService,
    private ordersPdfService: OrdersPdfService,
  ) {}

  @Get()
  async getOrders(): Promise<Order[]> {
    return await this.ordersService.getOrders();
  }

  @Get('/:id')
  async getProductById(@Param('id', ParseIntPipe) id: number): Promise<Order> {
    return await this.ordersService.getOrderById(id);
  }

  @Post()
  async createOrder(@Body() createOrderDto: CreateOrderDto): Promise<Order> {
    return await this.ordersService.createOrder(createOrderDto);
  }

  @Patch('/:id')
  async updateOrder(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrderDto: UpdateOrderDto,
  ): Promise<Order> {
    const isUpdate =
      !!updateOrderDto.clientId ||
      !!updateOrderDto.comment ||
      !!updateOrderDto.dateDelivery ||
      !!updateOrderDto.isRent ||
      !!updateOrderDto.products;

    if (isUpdate) {
      return await this.ordersService.updateOrder(id, updateOrderDto);
    } else {
      return await this.ordersService.deliverOrder(id);
    }
  }

  @Delete('/:id')
  async deleteOrder(@Param('id') id: number) {
    await this.ordersService.deleteOrder(id);
  }

  @Get('/rent-pdf/:id')
  async getRentPdf(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    this.ordersPdfService.getRentPdf(id).then(() => {
      const file = join(
        __dirname,
        '..',
        '..',
        '..',
        'public',
        'rent-pdf',
        `${id}.pdf`,
      );
      send(req, file).pipe(res);
    });
  }
}
