import { ApiProperty } from '@nestjs/swagger';

export class TokenWithExpDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
    description: 'JWT token',
  })
  public readonly token: string;

  @ApiProperty({
    example: 1691169139646,
    description: 'expiration time',
  })
  public readonly exp: number;
}
