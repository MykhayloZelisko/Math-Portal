import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ParseImageFilePipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (!value.mimetype.includes('image')) {
      throw new BadRequestException('File must be a picture in jpg/jpeg/svg/png format')
    }
    return value;
  }
}
