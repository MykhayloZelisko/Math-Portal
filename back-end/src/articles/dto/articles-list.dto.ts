import { ApiProperty } from '@nestjs/swagger';
import { Article } from '../models/article.model';

export class ArticlesListDto {
  @ApiProperty({ example: 1234, description: 'Number of articles' })
  public readonly total: number;

  @ApiProperty({
    example: [
      {
        id: 1,
        title: 'Title',
      },
    ],
    description: 'Array of articles',
  })
  public readonly articles: Article[];
}