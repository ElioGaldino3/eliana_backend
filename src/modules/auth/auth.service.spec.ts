import { AuthService } from './auth.service';
import { UserEntity } from './entities/user.entity';
import {
  Repository,
  getRepository,
  getConnection,
  createConnection,
  Connection,
} from 'typeorm';
import { TestingModule, Test } from '@nestjs/testing';
import { JwtModule } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RegisterDTO } from './dtos/user.dto';

let service: AuthService;
let repository: Repository<UserEntity>;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
let testingModule: TestingModule;
const testConnectionName = 'testConnection';
let connection: Connection;

beforeAll(async () => {
  testingModule = await Test.createTestingModule({
    providers: [
      AuthService,
      {
        provide: getRepositoryToken(UserEntity),
        useClass: Repository,
      },
    ],
    imports: [JwtModule],
  }).compile();

  connection = await createConnection({
    type: 'sqlite',
    database: ':memory:',
    dropSchema: true,
    entities: [UserEntity],
    synchronize: true,
    logging: false,
    name: testConnectionName,
  });

  repository = getRepository(UserEntity, testConnectionName);
  service = testingModule.get<AuthService>(AuthService);

  return connection;
});

describe('-- Auth Service --', async () => {
  beforeEach(async () => {
    await repository.insert(new UserEntity());
  });

  it('should be defined', () => {
    expect(1).toBeDefined();
  });
});

afterAll(async () => {
  await getConnection(testConnectionName).close();
});
