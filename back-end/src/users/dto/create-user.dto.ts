import { ApiProperty } from '@nestjs/swagger';
import { Column, DataType } from 'sequelize-typescript';

export class CreateUserDto {
  @ApiProperty({ example: 'email@mail.com', description: 'Email' })
  readonly email: string;

  @ApiProperty({ example: 'q1we5?!ER234', description: 'Password' })
  readonly password: string;

  @ApiProperty({ example: 'John', description: 'First name' })
  readonly firstName: string;

  @ApiProperty({ example: 'Doe', description: 'Last name' })
  readonly lastName: string;
}
