import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserRoleDto {
  @ApiProperty({ example: 1, description: 'Unique identifier' })
  public readonly userId: number;

  @ApiProperty({ example: false, description: 'User is an admin or not' })
  public readonly isAdmin: boolean;
}
