import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateBillingDTO } from './billing.dto';
import { Billing } from './billing.entity';
import { BillingRepository } from './billing.repository';
import { Cron } from '@nestjs/schedule';
import { writeFile } from 'fs';
import moment = require('moment');
@Injectable()
export class BillingService {
  private readonly logger = new Logger(BillingService.name);

  constructor(
    @InjectRepository(BillingRepository)
    private billingRepo: BillingRepository,
  ) { }

  async getBillings(): Promise<Billing[]> {
    return this.billingRepo.find({ order: { created: "DESC" } })
  }

  async createBilling(billingDto: CreateBillingDTO) {
    const billing = new Billing()

    billing.content = billingDto.content
    billing.value = String(billingDto.value)

    return await billing.save();
  }

  async deleteBilling(id: number): Promise<void> {
    const billing = await this.billingRepo.findOne(id);

    if (!billing) {
      throw new NotFoundException("Billing not found")
    }

    await billing.remove()
  }

  @Cron('* * 3 * * 1-6')
  async handleBackup() {
    const billings = JSON.stringify(await this.getBillings());
    const path = process.env.BACKUP_PATH + `/${moment().format()}` + '.billings.json'
    writeFile(path, billings, 'utf8', err => {
      if (err) {
        this.logger.error(err);
      } else {
        this.logger.log("bfeg :D");
      }
    });
  }
}
