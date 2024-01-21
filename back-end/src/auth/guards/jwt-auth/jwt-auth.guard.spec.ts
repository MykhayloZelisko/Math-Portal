import { JwtAuthGuard } from './jwt-auth.guard';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;
  const mockJwtService = {
    verify: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtAuthGuard,
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    guard = module.get<JwtAuthGuard>(JwtAuthGuard);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('canActivate', () => {
    it('should throw UnauthorizedException for empty token', () => {
      const contextMock = {
        switchToHttp: () => ({
          getRequest: (): unknown => ({
            headers: {
              authorization: 'Bearer',
            },
          }),
        }),
      } as ExecutionContext;

      expect(() => guard.canActivate(contextMock)).toThrow(
        new UnauthorizedException('User is not authorized'),
      );
    });

    it('should throw UnauthorizedException for empty header', () => {
      const contextMock = {
        switchToHttp: () => ({
          getRequest: (): unknown => ({
            headers: {},
          }),
        }),
      } as ExecutionContext;

      expect(() => guard.canActivate(contextMock)).toThrow(
        new UnauthorizedException('User is not authorized'),
      );
    });

    it('should throw UnauthorizedException for invalid token', () => {
      const contextMock = {
        switchToHttp: () => ({
          getRequest: (): unknown => ({
            headers: {
              authorization: 'Bearer invalidToken',
            },
          }),
        }),
      } as ExecutionContext;
      mockJwtService.verify.mockImplementation(() => {
        throw Error();
      });

      expect(() => guard.canActivate(contextMock)).toThrow(
        new UnauthorizedException('User is not authorized'),
      );
    });

    it('should return true', () => {
      const contextMock = {
        switchToHttp: () => ({
          getRequest: (): unknown => ({
            headers: {
              authorization: 'Bearer validToken',
            },
          }),
        }),
      } as ExecutionContext;
      mockJwtService.verify.mockReturnValue({});

      expect(guard.canActivate(contextMock)).toBeTruthy();
    });
  });
});
