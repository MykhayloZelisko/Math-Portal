import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsUUID } from 'class-validator';

export class CreateRatingDto {
  @ApiProperty({ example: 5, description: 'Rating' })
  @IsIn([1, 2, 3, 4, 5], { message: 'A value must be from the array [1, 2, 3, 4, 5]'})
  public readonly rate: 1 | 2 | 3 | 4 | 5;

  @ApiProperty({ example: '68f48b22-8104-4b47-b846-3db152d8b0ee', description: 'Article id' })
  @IsUUID(4,{ message: 'Must be a UUID v4 string'})
  public readonly articleId: string;
}
