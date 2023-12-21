import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TokenWithExpDto } from './dto/token-with-exp.dto';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';

describe('AuthController', () => {
  let controller: AuthController;
  const mockAuthService = {
    login: jest.fn(),
    registration: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should return token', async () => {
      const mockToken: TokenWithExpDto = {
        token: 'token',
        exp: 60,
      };
      const mockLoginDto: LoginDto = {
        email: 'email@mail.com',
        password: 'Pa$$word094',
      };
      mockAuthService.login.mockReturnValue(mockToken);
      const result = await controller.login(mockLoginDto);

      expect(result).toEqual(mockToken);
    });
  });

  describe('registration', () => {
    it('should return nothing', async () => {
      const mockNewUser: CreateUserDto = {
        email: 'email@mail.com',
        password: 'Pa$$word094',
        firstName: 'John',
        lastName: 'Doe',
      };
      mockAuthService.registration.mockReturnValue(void 0);
      const result = await controller.registration(mockNewUser);

      expect(result).toBeUndefined();
    });
  });
});
