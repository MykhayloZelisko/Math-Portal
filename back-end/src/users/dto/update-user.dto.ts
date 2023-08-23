import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsNotEmpty, IsOptional, IsString, Length, Matches, MinLength } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({ example: 'email@mail.com', description: 'Email' })
  @IsString({ message: 'Must be a string'})
  @Matches(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/, { message: 'Email is incorrect'})
  @IsNotEmpty({ message: 'Must be a not empty string'})
  public readonly email: string;

  @ApiProperty({ example: 'q1we5?!ER234', description: 'Password' })
  @IsString({ message: 'Must be a string'})
  @Length(8, 32, { message: 'Must be between 8 and 32 characters'})
  @Matches(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[*.!@$%^&(){}\[\]:;<>,.?\/~_+\-=|\\]).{8,32}$/, { message: 'Password is incorrect'})
  @IsNotEmpty({ message: 'Must be a not empty string'})
  public readonly password: string;

  @ApiProperty({ example: 'John', description: 'First name' })
  @IsString({ message: 'Must be a string'})
  @MinLength(3, { message: 'Must be more than 3 characters'})
  @Matches(/^([A-Z]{1}[a-z-]+|[А-Я]{1}[а-я-]+)$/, { message: 'First name is incorrect'})
  @IsNotEmpty({ message: 'Must be a not empty string'})
  public readonly firstName: string;

  @ApiProperty({ example: 'Doe', description: 'Last name' })
  @IsString({ message: 'Must be a string'})
  @MinLength(3, { message: 'Must be more than 3 characters'})
  @Matches(/^([A-Z]{1}[a-z-]+|[А-Я]{1}[а-я-]+)$/, { message: 'Last name is incorrect'})
  @IsNotEmpty({ message: 'Must be a not empty string'})
  public readonly lastName: string;

  @ApiProperty({ example: 'q1we5?!ER234', description: 'New password' })
  @IsOptional()
  @IsString({ message: 'Must be a string'})
  @Length(8, 32, { message: 'Must be between 8 and 32 characters'})
  @Matches(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[*.!@$%^&(){}\[\]:;<>,.?\/~_+\-=|\\]).{8,32}$/, { message: 'Password is incorrect'})
  @IsNotEmpty({ message: 'Must be a not empty string'})
  public readonly newPassword: string | null;
}
