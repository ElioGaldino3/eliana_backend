import { Test, TestingModule } from '@nestjs/testing';

import { BillingService } from './billing.service';
import { BillingController } from './billing.controller';
import { Billing } from './billing.entity';
import { CreateBillingDTO } from './billing.dto';

jest.mock('./billing.service');

describe('-- Billing Controller --', () => {
  let billingService: BillingService;
  let module: TestingModule;
  let billingController: BillingController;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [BillingController],
      providers: [BillingService],
    }).compile();

    billingService = module.get<BillingService>(BillingService);
    billingController = module.get(BillingController);
  });

  it('should create a new billing', async () => {
    const expectResult = new Billing();
    const mockBilling = new CreateBillingDTO();
    mockBilling.content = 'content test';
    mockBilling.value = 55.5;

    jest.spyOn(billingService, 'createBilling').mockResolvedValue(expectResult);

    expect(await billingController.createBilling(mockBilling)).toBe(
      expectResult,
    );
  });

  it('should get all billings', async () => {
    const expectResult = [new Billing()];
    jest
      .spyOn(billingService, 'getBillings')
      .mockResolvedValue([new Billing()]);

    expect(await billingController.getBillings()).toStrictEqual(expectResult);
  });

  it('should delete billing', async () => {
    expect(await billingController.deleteBilling(1)).toBeUndefined();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });
});