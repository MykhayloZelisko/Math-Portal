import { ApiProperty } from '@nestjs/swagger';

export class CreateArticleDto {
  @ApiProperty({ example: 'Title', description: 'Title' })
  public readonly title: string;

  @ApiProperty({ example: 'Text', description: 'Text' })
  public readonly content: string;

  @ApiProperty({ example: [1], description: 'Array of tags' })
  public readonly tagsIds: string[];
}
