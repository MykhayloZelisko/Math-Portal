import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ParseIntegerPipe implements PipeTransform {
  public async transform(value: any, metadata: ArgumentMetadata) {
    const isNumber = !isNaN(parseFloat(value)) && isFinite(value);
    const isInteger = Number(value) === Math.trunc(value);
    const isPositive = value > 0;
    if (!isNumber || !isInteger || !isPositive) {
      throw new BadRequestException(`${metadata.data} - Must be a positive integer number`);
    }
    return value;
  }
}
