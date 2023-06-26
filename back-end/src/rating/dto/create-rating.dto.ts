import { ApiProperty } from '@nestjs/swagger';

export class CreateRatingDto {
  @ApiProperty({ example: 5, description: 'Rating' })
  public readonly rate: 0 | 1 | 2 | 3 | 4 | 5;

  @ApiProperty({ example: 5, description: 'Article id' })
  public readonly articleId: number;

  @ApiProperty({ example: 5, description: 'User id' })
  public readonly userId: number;
}
