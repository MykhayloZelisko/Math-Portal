import { ApiProperty } from '@nestjs/swagger';
import { Article } from '../models/article.model';

export class ArticlesListDto {
  @ApiProperty({ example: 1234, description: 'Number of articles' })
  public readonly total: number;

  @ApiProperty({
    example: [
      {
        id: '68f48b22-8104-4b47-b846-3db152d8b0ee',
        title: 'Title',
      },
    ],
    description: 'Array of articles',
  })
  public readonly articles: Article[];
}
