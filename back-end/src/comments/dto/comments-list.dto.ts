import { ApiProperty } from '@nestjs/swagger';
import { Comment } from '../models/comment.model';

export class CommentsListDto {
  @ApiProperty({ example: 1234, description: 'Number of comments' })
  public readonly total: number;

  @ApiProperty({
    example: [
      {
        id: '64ee5cdc-e42f-49cf-8b27-0b8cb1534f58',
        content: 'comment',
        createdAt: '2023-11-24T12:41:18.840Z',
        updatedAt: '2023-11-24T12:41:18.840Z',
        likesUsersIds: [],
        dislikesUsersIds: [],
        level: 3,
        user: {
          id: '555ccef0-7243-4647-a220-50cc92ffa7e0',
          firstName: 'John',
          lastName: 'Doe',
          photo: '4b151244-4950-4664-b03f-a30757f9f50f.png',
        },
      },
    ],
    description: 'Array of comments',
  })
  public readonly comments: Comment[];
}
