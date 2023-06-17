import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateArticleDto } from './create-article.dto';

export class UpdateArticleDto extends PartialType(CreateArticleDto) {
  @ApiProperty({ example: 'Title', description: 'Title' })
  public readonly title: string;

  @ApiProperty({ example: 'Text', description: 'Text' })
  public readonly text: string;

  @ApiProperty({ example: [1], description: 'Array of tags' })
  public readonly tagsIds: number[];

  @ApiProperty({ example: [1], description: 'Array of users' })
  public readonly usersIds: number[];
}
