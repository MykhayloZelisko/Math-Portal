import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({ example: 'email@mail.com', description: 'Email' })
  public readonly email: string;

  @ApiProperty({ example: 'q1we5?!ER234', description: 'Password' })
  public readonly password: string;

  @ApiProperty({ example: 'John', description: 'First name' })
  public readonly firstName: string;

  @ApiProperty({ example: 'Doe', description: 'Last name' })
  public readonly lastName: string;
}
