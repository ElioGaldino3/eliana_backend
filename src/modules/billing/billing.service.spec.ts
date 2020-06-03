import { BillingService } from './billing.service';
import {
  Repository,
  getRepository,
  getConnection,
  createConnection,
} from 'typeorm';
import { Billing } from './billing.entity';
import { TestingModule, Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateBillingDTO } from './billing.dto';
import { NotFoundException } from '@nestjs/common';

let service: BillingService;
let repository: Repository<Billing>;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
let testingModule: TestingModule;

const testConnectionName = 'testConnection';

beforeAll(async () => {
  testingModule = await Test.createTestingModule({
    providers: [
      BillingService,
      {
        provide: getRepositoryToken(Billing),
        useClass: Repository,
      },
    ],
  }).compile();

  const connection = await createConnection({
    type: 'sqlite',
    database: ':memory:',
    dropSchema: true,
    entities: [Billing],
    synchronize: true,
    logging: false,
    name: testConnectionName,
  });

  repository = getRepository(Billing, testConnectionName);
  service = new BillingService(repository);

  return connection;
});

describe('-- Billing Service --', () => {
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return list of billings', async () => {
    const newBilling = new Billing();
    newBilling.content = 'test content';
    newBilling.value = '15.5';

    await repository.insert(newBilling);

    const billings = await service.getBillings();
    expect(billings.length).toBe(1);
  });

  it('should return a created billing', async () => {
    const newBilling = new CreateBillingDTO();
    newBilling.content = 'content';
    newBilling.value = 1.5;

    expect(await service.createBilling(newBilling)).toBeInstanceOf(Billing);
  });

  it('should delete billing', async () => {
    const billingId = 1;

    expect(await service.deleteBilling(billingId)).toBeUndefined();
  });

  it('should return error not found billing', async () => {
    const billingId = -1;

    try {
      await service.deleteBilling(billingId);
    } catch (error) {
      expect(error).toEqual(new NotFoundException('Billing not found'));
    }
  });
});

afterAll(async () => {
  await getConnection(testConnectionName).close();
});
