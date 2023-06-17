import { ApiProperty } from '@nestjs/swagger';

export class CreateArticleDto {
  @ApiProperty({ example: 'Title', description: 'Title' })
  public readonly title: string;

  @ApiProperty({ example: 'Text', description: 'Text' })
  public readonly text: string;

  @ApiProperty({ example: [1], description: 'Array of tags' })
  public readonly tagsIds: number[];

  @ApiProperty({ example: [1], description: 'Array of users' })
  public readonly usersIds: number[];
}
