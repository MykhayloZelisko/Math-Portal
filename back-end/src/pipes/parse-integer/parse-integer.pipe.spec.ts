import { ParseIntegerPipe } from './parse-integer.pipe';
import { ArgumentMetadata, BadRequestException } from '@nestjs/common';

describe('ParseIntegerPipe', () => {
  const pipe: ParseIntegerPipe = new ParseIntegerPipe();

  it('should be defined', () => {
    expect(pipe).toBeDefined();
  });

  it('should throw error', () => {
    const mockMetadata: ArgumentMetadata = { data: 'size', type: 'query' };
    const mockValue = '-124';

    expect(() => pipe.transform(mockValue, mockMetadata)).toThrow(
      new BadRequestException(
        'size - Must be a positive integer number',
        'Validation Error',
      ),
    );
  });

  it('should return 123', () => {
    const mockMetadata: ArgumentMetadata = { data: 'size', type: 'param' };
    const mockValue = '123';

    expect(pipe.transform(mockValue, mockMetadata)).toBe(mockValue);
  });
});
