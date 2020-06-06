import { AuthService } from './auth.service';
import { TestingModule, Test } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { RegisterDTO } from './dtos/user.dto';
import { UserEntity } from './entities/user.entity';

jest.mock('./auth.service');

describe('-- Auth Controller --', () => {
  let authService: AuthService;
  let module: TestingModule;
  let authController: AuthController;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    authController = module.get(AuthController);
  });

  it('should create a new user', async () => {
    const expectResult = {
      user: {
        token: 'userToken',
        username: 'eliogaldino',
      },
    };
    const mockUser = new RegisterDTO();

    jest.spyOn(authService, 'register').mockResolvedValue(expectResult);

    expect(await authController.register(mockUser)).toBe(expectResult);
  });

  it('should login', async () => {
    const expectResult = {
      user: {
        token: 'userToken',
        username: 'eliogaldino',
      },
    };
    const mockUser = new RegisterDTO();

    jest.spyOn(authService, 'login').mockResolvedValue(expectResult);

    expect(await authController.login(mockUser)).toBe(expectResult);
  });

  it('get user', async () => {
    const expectResult = new UserEntity();

    jest.spyOn(authService, 'getUser').mockResolvedValue(expectResult);

    expect(await authController.getUser({ user: { id: 1 } })).toBe(
      expectResult,
    );
  });
});
