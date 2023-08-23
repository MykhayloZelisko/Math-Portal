import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsUUID } from 'class-validator';

export class UpdateLikeDislikeDto {
  @ApiProperty({
    example: '68f48b22-8104-4b47-b846-3db152d8b0ee',
    description: 'Comment identifier',
  })
  @IsUUID(4, { message: 'Must be a UUID v4 string' })
  public commentId: string;

  @ApiProperty({ example: 1, description: 'like = 1, dislike = -1' })
  @IsIn([-1, 1], { message: 'A value must be 1 or -1' })
  public status: 1 | -1;
}
