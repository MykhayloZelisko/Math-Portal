import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({ example: 'Comment', description: 'Content' })
  public content: string;

  @ApiProperty({ example: 123, description: 'Article id' })
  public articleId: number;

  @ApiProperty({ example: 5, description: 'Parent comment id' })
  public parentCommentId: number;

  @ApiProperty({ example: 5, description: 'Level' })
  public level: number;
}
