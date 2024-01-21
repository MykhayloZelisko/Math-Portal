import { Test, TestingModule } from '@nestjs/testing';
import { FilesService } from './files.service';
import { InternalServerErrorException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

describe('FilesService', () => {
  let service: FilesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FilesService],
    }).compile();

    service = module.get<FilesService>(FilesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createImageFile', () => {
    it('should create image file successfully', async () => {
      const mockFile: Express.Multer.File = {
        originalname: 'test.jpg',
        buffer: Buffer.from('mocked image content'),
      } as Express.Multer.File;
      jest.spyOn(fs.promises, 'writeFile');
      const createdFileName = await service.createImageFile(mockFile);
      const filePath = path.resolve(
        __dirname,
        '..',
        '..',
        'static',
        createdFileName,
      );

      expect(createdFileName).toMatch(/^[a-f0-9-]+\.jpg$/);
      expect(fs.promises.writeFile).toHaveBeenCalledWith(
        filePath,
        mockFile.buffer,
      );

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });

    it('should throw internal server error exception', async () => {
      jest.spyOn(fs.promises, 'mkdir').mockResolvedValue('');
      jest
        .spyOn(fs.promises, 'writeFile')
        .mockRejectedValueOnce(new Error('Failed to write file'));
      jest.spyOn(fs, 'existsSync').mockReturnValue(false);
      const mockFile: Express.Multer.File = {
        originalname: 'test.jpg',
        buffer: Buffer.from('mocked image content'),
      } as Express.Multer.File;
      const result = service.createImageFile(mockFile);

      await expect(result).rejects.toThrow(
        new InternalServerErrorException('Something went wrong'),
      );
    });
  });

  describe('removeImageFile', () => {
    it('should remove image file successfully', async () => {
      const fileName = 'testFile.jpg';
      const unlinkMock = jest
        .spyOn(fs, 'unlink')
        .mockImplementation((_, callback) => callback(null));
      await service.removeImageFile(fileName);
      const filePath = path.resolve(__dirname, '..', '..', 'static', fileName);

      expect(unlinkMock).toHaveBeenCalledWith(filePath, expect.any(Function));
    });

    it('should throw internal server error exception', async () => {
      const mockFileName = 'test.jpg';
      jest
        .spyOn(fs, 'unlink')
        .mockImplementation((_, callback) =>
          callback(new Error('Failed to remove file')),
        );

      await expect(service.removeImageFile(mockFileName)).rejects.toThrow(
        new InternalServerErrorException('File is not removed'),
      );
    });
  });
});
