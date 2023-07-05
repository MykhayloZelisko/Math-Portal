import { ApiProperty } from '@nestjs/swagger';
import { User } from '../models/user.model';

export class UsersListDto {
  @ApiProperty({ example: 1234, description: 'Number of users' })
  public readonly total: number;

  @ApiProperty({
    example: [{
      id: 1,
      email: 'test@email',
      firstName: 'John',
      lastName: 'Doe',
      isAdmin: false,
    }],
    description: 'Array of users',
  })
  public readonly users: User[];
}
