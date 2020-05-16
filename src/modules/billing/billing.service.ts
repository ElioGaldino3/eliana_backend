import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateBillingDTO } from './billing.dto';
import { Billing } from './billing.entity';
import { BillingRepository } from './billing.repository';

@Injectable()
export class BillingService {
  constructor(
    @InjectRepository(BillingRepository)
    private billingRepo: BillingRepository,
  ) { }

  async getBillings(): Promise<Billing[]> {
    return this.billingRepo.find({order: {created: "DESC"}})
  }

  async createBilling(billingDto: CreateBillingDTO) {
    const billing = new Billing()

    billing.content = billingDto.content
    billing.value = String(billingDto.value)

    return await billing.save();
  }

  async deleteBilling(id: number): Promise<void>{
    const billing = await this.billingRepo.findOne(id);

    if(!billing){
      throw new NotFoundException("Billing not found")
    }

    await billing.remove()
  }
}
