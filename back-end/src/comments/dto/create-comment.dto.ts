import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({ example: 'Comment', description: 'Content' })
  @IsString({ message: 'Must be a string' })
  @IsNotEmpty({ message: 'Must be a not empty string' })
  public content: string;

  @ApiProperty({
    example: '68f48b22-8104-4b47-b846-3db152d8b0ee',
    description: 'Article id',
  })
  @IsUUID(4, { message: 'Must be a UUID v4 string' })
  public articleId: string;

  @ApiProperty({
    example: '68f48b22-8104-4b47-b846-3db152d8b0ee',
    description: 'Parent comment id',
  })
  @IsOptional()
  @IsUUID(4, { message: 'Must be a UUID v4 string' })
  public parentCommentId: string | null;

  @ApiProperty({ example: 5, description: 'Level' })
  @IsInt({ message: 'Must be an integer number' })
  @IsPositive({ message: 'Must be a positive number' })
  public level: number;
}
