import { Controller, Get, UseGuards, Post, Body, Delete, Param, ParseIntPipe } from '@nestjs/common';
import { BillingService } from './billing.service';
import { Billing } from './billing.entity';
import { AuthGuard } from '@nestjs/passport';
import { CreateBillingDTO } from './billing.dto';

@Controller('billings')
@UseGuards(AuthGuard('jwt'))
export class BillingController {
  constructor(
    private billingService: BillingService,
  ) { }

  @Get()
  async getBillings(): Promise<Billing[]> {
    return await this.billingService.getBillings();
  }

  @Post()
  async createBilling(@Body() createBillingDto: CreateBillingDTO): Promise<Billing> {
    return await this.billingService.createBilling(createBillingDto);
  }

  @Delete("/:id")
  async deleteBilling(@Param("id", ParseIntPipe) id: number): Promise<void> {
    await this.billingService.deleteBilling(id);
  }
}
