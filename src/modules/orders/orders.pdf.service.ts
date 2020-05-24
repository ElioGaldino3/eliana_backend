import { OrdersService } from './orders.service'
import { Injectable } from '@nestjs/common'
import pdfGenerator from './generator.pdf'
@Injectable()
export class OrdersPdfService {

  constructor(
    private ordersService: OrdersService,
    
  ) { }
  async getRentPdf(id: number){
    const order = await this.ordersService.getOrderById(id)
    
    return pdfGenerator(order)
  }
}
