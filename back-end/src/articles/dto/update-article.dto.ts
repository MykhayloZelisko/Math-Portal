import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateArticleDto } from './create-article.dto';
import { ArrayMinSize, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class UpdateArticleDto extends PartialType(CreateArticleDto) {
  @ApiProperty({ example: 'Title', description: 'Title' })
  @IsString({ message: 'Must be a string'})
  @IsNotEmpty({ message: 'Must be a not empty string'})
  public readonly title: string;

  @ApiProperty({ example: 'Text', description: 'Text' })
  @IsString({ message: 'Must be a string'})
  @IsNotEmpty({ message: 'Must be a not empty string'})
  public readonly content: string;

  @ApiProperty({ example: ['68f48b22-8104-4b47-b846-3db152d8b0ee'], description: 'Array of tags ids' })
  @ArrayMinSize(1, { message: 'Must contain at least one tag id'})
  @IsUUID(4,{ message: 'Must be a UUID v4 string', each: true})
  public readonly tagsIds: string[];
}
