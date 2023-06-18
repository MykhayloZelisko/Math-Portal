import { ApiProperty } from '@nestjs/swagger';

export class ArticleRatingDto {
  @ApiProperty({ example: 3.5, description: `Article's rating` })
  public readonly rating: number;
}
