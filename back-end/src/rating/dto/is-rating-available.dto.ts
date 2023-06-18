import { ApiProperty } from '@nestjs/swagger';

export class IsRatingAvailableDto {
  @ApiProperty({ example: true, description: 'Is rating available?' })
  public readonly isAvailable: boolean;
}
