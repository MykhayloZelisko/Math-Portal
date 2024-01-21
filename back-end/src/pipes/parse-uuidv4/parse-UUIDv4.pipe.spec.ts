import { ParseUUIDv4Pipe } from './parse-UUIDv4.pipe';
import { ArgumentMetadata, BadRequestException } from '@nestjs/common';

describe('ParseUUIDv4Pipe', () => {
  const pipe: ParseUUIDv4Pipe = new ParseUUIDv4Pipe();

  it('should be defined', () => {
    expect(pipe).toBeDefined();
  });

  it('should throw error', () => {
    const mockMetadata: ArgumentMetadata = { data: 'id', type: 'param' };
    const mockValue = 'b6c66990-a99e-11ee-a506-0242ac120002';

    expect(() => pipe.transform(mockValue, mockMetadata)).toThrow(
      new BadRequestException(
        'id - Must be a string in UUIDv4 format',
        'Validation Error',
      ),
    );
  });

  it('should return id', () => {
    const mockMetadata: ArgumentMetadata = { data: 'id', type: 'param' };
    const mockValue = 'be8e95b0-98eb-4736-8460-1ef950ceb50a';

    expect(pipe.transform(mockValue, mockMetadata)).toBe(mockValue);
  });
});
