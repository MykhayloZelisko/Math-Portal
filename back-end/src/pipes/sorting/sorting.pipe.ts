import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class SortingPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (value.toLowerCase() !== 'asc' && value.toLowerCase() !== 'desc' && value.toLowerCase() !=='default') {
      throw new BadRequestException(`${metadata.data} - A value must be from the array ['asc', 'desc', 'default']`);
    }
    return value;
  }
}
