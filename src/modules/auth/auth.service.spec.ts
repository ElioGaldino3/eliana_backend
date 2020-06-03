// import { AuthService } from './auth.service';
// import { UserEntity } from './entities/user.entity';
// import { Repository, getRepository } from 'typeorm';
// import { TestingModule, Test } from '@nestjs/testing';
// import { JwtModule } from '@nestjs/jwt';
// import { PassportModule } from '@nestjs/passport';

// let service: AuthService;
// let repository: Repository<UserEntity>;
// // eslint-disable-next-line @typescript-eslint/no-unused-vars
// let testingModule: TestingModule;

// const testConnectionName = 'testConnection';

// beforeAll(async () => {
//   testingModule = await Test.createTestingModule({
//     providers: [
//       AuthService,
//       {
//         provide: getRepositoryToken(UserEntity),
//         useClass: Repository,
//       },
//     ],
//     imports: [
//       JwtModule.register({
//         secret: process.env.SECRET,
//         signOptions: {
//           expiresIn: '3d',
//         },
//       }),
//       PassportModule.register({ defaultStrategy: 'jwt' }),
//     ],
//   }).compile();

//   const connection = await createConnection({
//     type: 'sqlite',
//     database: ':memory:',
//     dropSchema: true,
//     entities: [UserEntity],
//     synchronize: true,
//     logging: false,
//     name: testConnectionName,
//   });

//   repository = getRepository(UserEntity, testConnectionName);
//   service = new AuthService(repository);

//   return connection;
// });

// afterAll(async () => {
//   await getConnection(testConnectionName).close();
// });
