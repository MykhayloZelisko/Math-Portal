import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({ example: 'Comment', description: 'Content' })
  public content: string;

  @ApiProperty({ example: '68f48b22-8104-4b47-b846-3db152d8b0ee', description: 'Article id' })
  public articleId: string;

  @ApiProperty({ example: '68f48b22-8104-4b47-b846-3db152d8b0ee', description: 'Parent comment id' })
  public parentCommentId: string | null;

  @ApiProperty({ example: 5, description: 'Level' })
  public level: number;
}
