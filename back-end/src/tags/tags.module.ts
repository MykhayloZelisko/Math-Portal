import { Module } from '@nestjs/common';
import { TagsController } from './tags.controller';
import { TagsService } from './tags.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Tag } from './models/tag.model';
import { AuthModule } from '../auth/auth.module';
import { Article } from '../articles/models/article.model';
import { ArticleTags } from '../articles/models/article-tags.model';

@Module({
  controllers: [TagsController],
  providers: [TagsService],
  imports: [SequelizeModule.forFeature([Tag, Article, ArticleTags]), AuthModule],
})
export class TagsModule {}
