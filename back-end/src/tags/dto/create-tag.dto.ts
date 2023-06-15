import { ApiProperty } from '@nestjs/swagger';

export class CreateTagDto {
  @ApiProperty({ example: 'algebra', description: "tag's name" })
  public readonly value: string;
}
