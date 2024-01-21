import { ValidationPipe } from './validation.pipe';
import { ArgumentMetadata } from '@nestjs/common';
import { LoginDto } from '../../auth/dto/login.dto';

describe('ValidationPipe', () => {
  const pipe: ValidationPipe = new ValidationPipe();

  it('should be defined', () => {
    expect(pipe).toBeDefined();
  });

  it('should throw error', async () => {
    const mockMessages: string[] = [
      'email - Email is incorrect',
      'password - Password is incorrect, Must be between 8 and 32 characters',
    ];
    const mockValue: LoginDto = {
      email: 'email',
      password: '!1Qw',
    };
    const mockMetadata: ArgumentMetadata = {
      type: 'body',
      metatype: LoginDto,
    };

    try {
      await pipe.transform(mockValue, mockMetadata);
    } catch (error) {
      expect(error.getResponse()).toEqual({
        error: 'Validation Error',
        message: mockMessages,
        statusCode: 400,
      });
    }
  });

  it('should return value', async () => {
    const mockValue: LoginDto = {
      email: 'email@mail.com',
      password: '!123Qwerty',
    };
    const mockMetadata: ArgumentMetadata = {
      type: 'body',
      metatype: LoginDto,
    };
    const result = await pipe.transform(mockValue, mockMetadata);

    expect(result).toBe(mockValue);
  });
});
