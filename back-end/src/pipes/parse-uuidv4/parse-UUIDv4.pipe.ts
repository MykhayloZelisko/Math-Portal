import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { validate as uuidValidate, version as uuidVersion } from 'uuid';

@Injectable()
export class ParseUUIDv4Pipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (!uuidValidate(value) || uuidVersion(value) !== 4) {
      throw new BadRequestException(`${metadata.data} - Must be a string in UUIDv4 format`);
    }
    return value;
  }
}
