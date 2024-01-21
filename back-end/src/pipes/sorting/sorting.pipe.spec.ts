import { SortingPipe } from './sorting.pipe';
import { ArgumentMetadata, BadRequestException } from '@nestjs/common';

describe('SortingPipe', () => {
  const pipe: SortingPipe = new SortingPipe();

  it('should be defined', () => {
    expect(pipe).toBeDefined();
  });

  it('should throw error', () => {
    const mockMetadata: ArgumentMetadata = { data: 'sorting', type: 'query' };
    const mockValue = 'invalidValue';

    expect(() => pipe.transform(mockValue, mockMetadata)).toThrow(
      new BadRequestException(
        `sorting - A value must be from the array ['asc', 'desc', 'default']`,
        'Validation Error',
      ),
    );
  });

  it('should return default', () => {
    const mockMetadata: ArgumentMetadata = { data: 'sorting', type: 'query' };
    const mockValue = 'default';

    expect(pipe.transform(mockValue, mockMetadata)).toBe(mockValue);
  });
});
