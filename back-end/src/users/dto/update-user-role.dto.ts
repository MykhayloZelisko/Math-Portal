import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserRoleDto {
  @ApiProperty({ example: '68f48b22-8104-4b47-b846-3db152d8b0ee', description: 'Unique identifier' })
  public readonly userId: string;

  @ApiProperty({ example: false, description: 'User is an admin or not' })
  public readonly isAdmin: boolean;
}
