import { ApiProperty } from '@nestjs/swagger';

export class UpdateLikeDislikeDto {
  @ApiProperty({ example: 1, description: 'Comment identifier' })
  public commentId: number;

  @ApiProperty({ example: 1, description: 'like = 1, dislike = -1' })
  public status: 1 | -1;
}
