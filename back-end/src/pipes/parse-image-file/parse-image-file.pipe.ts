import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ParseImageFilePipe implements PipeTransform {
  public transform(value: Express.Multer.File) {
    if (!value.mimetype.includes('image')) {
      throw new BadRequestException(
        'File must be an image in jpg/jpeg/svg/png format',
      );
    }
    return value;
  }
}
