import { OmitType } from '@nestjs/swagger';
import { CreateArticleDto } from './create-article.dto';

export class UpdateArticleDto extends OmitType(CreateArticleDto, []) {}
