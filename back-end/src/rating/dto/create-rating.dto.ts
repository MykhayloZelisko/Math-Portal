import { ApiProperty } from '@nestjs/swagger';

export class CreateRatingDto {
  @ApiProperty({ example: 5, description: 'Rating' })
  public readonly rate: 0 | 1 | 2 | 3 | 4 | 5;

  @ApiProperty({ example: '68f48b22-8104-4b47-b846-3db152d8b0ee', description: 'Article id' })
  public readonly articleId: string;
}
