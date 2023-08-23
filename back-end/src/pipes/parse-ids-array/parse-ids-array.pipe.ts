import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { validate as uuidValidate, version as uuidVersion } from 'uuid';

@Injectable()
export class ParseIdsArrayPipe implements PipeTransform {
  public transform(value: any, metadata: ArgumentMetadata) {
    const tagsIds = value ? value.split(',').map(String) : [];
    let isValid = true;
    tagsIds.forEach((id: string) => {
      if (!uuidValidate(id) || uuidVersion(id) !== 4) {
        isValid = false;
      }
    });
    if (isValid) {
      return value;
    } else {
      throw new BadRequestException(
        `${metadata.data} - Must be the array of strings in UUIDv4 format`,
      );
    }
  }
}
