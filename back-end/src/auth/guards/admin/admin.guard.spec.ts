import { AdminGuard } from './admin.guard';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';

describe('AdminGuard', () => {
  let guard: AdminGuard;
  const mockJwtService = {
    verify: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminGuard,
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    guard = module.get<AdminGuard>(AdminGuard);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('canActivate', () => {
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

    it('should return false', () => {
      const contextMock = {
        switchToHttp: () => ({
          getRequest: (): unknown => ({
            headers: {
              authorization: 'Bearer validToken',
            },
          }),
        }),
      } as ExecutionContext;
      mockJwtService.verify.mockReturnValue({ isAdmin: false });

      expect(guard.canActivate(contextMock)).toBeFalsy();
    });
  });
});
