import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
  MinLength,
} from 'class-validator';

export class UpdateUserDto extends OmitType(CreateUserDto, []) {
  @ApiProperty({ example: 'q1we5?!ER234', description: 'New password' })
  @IsOptional()
  @IsString({ message: 'Must be a string' })
  @Length(8, 32, { message: 'Must be between 8 and 32 characters' })
  @Matches(
    /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[*.!@$%^&(){}\[\]:;<>,.?\/~_+\-=|\\]).{8,32}$/,
    { message: 'Password is incorrect' },
  )
  @IsNotEmpty({ message: 'Must be a not empty string' })
  public readonly newPassword: string | null;
}
