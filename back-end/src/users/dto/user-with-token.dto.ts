import { ApiProperty } from '@nestjs/swagger';
import { User } from '../models/user.model';
import { TokenWithExpDto } from '../../auth/dto/token-with-exp.dto';

export class UserWithTokenDto {
  @ApiProperty({
    example: {
      id: 1,
      email: 'test@email',
      firstName: 'John',
      lastName: 'Doe',
      isAdmin: false,
    },
    description: 'User',
  })
  public readonly user: User;

  @ApiProperty({
    example: { token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9' },
    description: 'Token',
  })
  public readonly token: TokenWithExpDto;
}
