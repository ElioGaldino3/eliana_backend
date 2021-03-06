import { Injectable, NotFoundException, Logger, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateBillingDTO } from './billing.dto';
import { Billing } from './billing.entity';
import { Repository } from 'typeorm';
@Injectable()
export class BillingService {
  constructor(
    @InjectRepository(Billing)
    private readonly billingRepo: Repository<Billing>,
  ) {}

  async getBillings(): Promise<Billing[]> {
    return this.billingRepo.find({ order: { created: "DESC" } })
  }

  async createBilling(billingDto: CreateBillingDTO) {
    if(!billingDto.value){
      throw new BadRequestException('Billing value is required');
    }
    const billing = new Billing()

    billing.content = billingDto.content
    billing.value = String(billingDto.value)

    return await this.billingRepo.save(billing);
  }

  async deleteBilling(id: number): Promise<void> {
    const billing = await this.billingRepo.findOne(id);

    if (!billing) {
      throw new NotFoundException("Billing not found")
    }

    await this.billingRepo.remove(billing)
  }
}
