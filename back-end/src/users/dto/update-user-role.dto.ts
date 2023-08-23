import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsUUID } from 'class-validator';

export class UpdateUserRoleDto {
  @ApiProperty({
    example: '68f48b22-8104-4b47-b846-3db152d8b0ee',
    description: 'Unique identifier',
  })
  @IsUUID(4, { message: 'Must be a UUID v4 string' })
  public readonly userId: string;

  @ApiProperty({ example: false, description: 'User is an admin or not' })
  @IsBoolean({ message: 'Must be a boolean value' })
  public readonly isAdmin: boolean;
}
