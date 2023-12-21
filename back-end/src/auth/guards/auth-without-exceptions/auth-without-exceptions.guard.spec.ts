import { AuthWithoutExceptionsGuard } from './auth-without-exceptions.guard';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';

describe('AuthWithoutExceptionsGuard', () => {
  let guard: AuthWithoutExceptionsGuard;
  const mockJwtService = {
    verify: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthWithoutExceptionsGuard,
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    guard = module.get<AuthWithoutExceptionsGuard>(AuthWithoutExceptionsGuard);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });
});
