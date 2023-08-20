import { ApiProperty } from '@nestjs/swagger';

export class UpdateLikeDislikeDto {
  @ApiProperty({ example: '68f48b22-8104-4b47-b846-3db152d8b0ee', description: 'Comment identifier' })
  public commentId: string;

  @ApiProperty({ example: 1, description: 'like = 1, dislike = -1' })
  public status: 1 | -1;
}
