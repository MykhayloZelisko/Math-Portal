import { ParseIdsArrayPipe } from './parse-ids-array.pipe';
import { ArgumentMetadata, BadRequestException } from '@nestjs/common';

describe('ParseIdsArrayPipe', () => {
  const pipe: ParseIdsArrayPipe = new ParseIdsArrayPipe();

  it('should be defined', () => {
    expect(pipe).toBeDefined();
  });

  it('should throw error', () => {
    const mockMetadata: ArgumentMetadata = { data: 'tagsIds', type: 'query' };
    const mockValue =
      'b6c66990-a99e-11ee-a506-0242ac120002,be8e95b0-98eb-4736-8460-1ef950ceb50a';

    expect(() => pipe.transform(mockValue, mockMetadata)).toThrow(
      new BadRequestException(
        'tagsIds - Must be the array of strings in UUIDv4 format',
        'Validation Error',
      ),
    );
  });

  it('should return string', () => {
    const mockMetadata: ArgumentMetadata = { data: 'tagsIds', type: 'query' };
    const mockValue =
      'cf27baad-85ec-4bc4-a782-33aa1387c6d9,be8e95b0-98eb-4736-8460-1ef950ceb50a';

    expect(pipe.transform(mockValue, mockMetadata)).toBe(mockValue);
  });

  it('should return empty string', () => {
    const mockMetadata: ArgumentMetadata = { data: 'tagsIds', type: 'query' };
    const mockValue = '';

    expect(pipe.transform(mockValue, mockMetadata)).toBe(mockValue);
  });
});
