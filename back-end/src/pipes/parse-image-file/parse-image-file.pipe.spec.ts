import { ParseImageFilePipe } from './parse-image-file.pipe';
import { BadRequestException } from '@nestjs/common';

describe('ParseImageFilePipe', () => {
  const pipe: ParseImageFilePipe = new ParseImageFilePipe();

  it('should be defined', () => {
    expect(pipe).toBeDefined();
  });

  it('should throw error', () => {
    const mockValue: Express.Multer.File = {
      mimetype: 'text/plain',
    } as Express.Multer.File;

    expect(() => pipe.transform(mockValue)).toThrow(
      new BadRequestException(
        'File must be an image in jpg/jpeg/svg/png format',
        'Validation Error',
      ),
    );
  });

  it('should return file', () => {
    const mockValue: Express.Multer.File = {
      mimetype: 'image/jpeg',
    } as Express.Multer.File;

    expect(pipe.transform(mockValue)).toBe(mockValue);
  });
});
