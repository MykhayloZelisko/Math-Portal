import { AuthWithoutExceptionsGuard } from './auth-without-exceptions.guard';

describe('AuthWithoutExceptionsGuard', () => {
  it('should be defined', () => {
    expect(new AuthWithoutExceptionsGuard()).toBeDefined();
  });
});
