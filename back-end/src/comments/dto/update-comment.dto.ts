import { PartialType } from '@nestjs/mapped-types';
import { CreateCommentDto } from './create-comment.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateCommentDto extends PartialType(CreateCommentDto) {
  @ApiProperty({ example: 'Comment', description: 'Content' })
  @IsString({ message: 'Must be a string'})
  @IsNotEmpty({ message: 'Must be a not empty string'})
  public content: string;
}
