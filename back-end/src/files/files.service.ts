import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidV4 } from 'uuid';

@Injectable()
export class FilesService {
  public async createImageFile(file: Express.Multer.File) {
    try {
      const fileName = uuidV4() + path.extname(file.originalname);
      const filePath = path.resolve(__dirname, '..', '..', 'static');
      if (!fs.existsSync(filePath)) {
        await fs.promises.mkdir(filePath, { recursive: true });
      }
      await fs.promises.writeFile(path.join(filePath, fileName), file.buffer);
      return fileName;
    } catch (e) {
      throw new InternalServerErrorException({
        message: 'Something went wrong',
      });
    }
  }

  public async removeImageFile(fileName: string) {
    const filePath = path.resolve(__dirname, '..', '..', 'static', fileName);
    fs.unlink(filePath, (err) => {
      if (err) {
        throw new InternalServerErrorException({
          message: 'File is not removed',
        });
      } else {
        return;
      }
    });
  }
}
