import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class ParseIntegerPipe implements PipeTransform {
  public transform(value: string, metadata: ArgumentMetadata): string {
    const isNumber = !isNaN(parseFloat(value)) && isFinite(Number(value));
    const isInteger = Number(value) === Math.trunc(Number(value));
    const isPositive = Number(value) > 0;
    if (!isNumber || !isInteger || !isPositive) {
      throw new BadRequestException(
        `${metadata.data} - Must be a positive integer number`,
        'Validation Error',
      );
    }
    return value;
  }
}
