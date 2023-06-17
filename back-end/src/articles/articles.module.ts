import { Module } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { ArticlesController } from './articles.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Tag } from '../tags/models/tag.model';
import { Article } from './models/article.model';
import { AuthModule } from '../auth/auth.module';
import { ArticleTags } from './models/article-tags.model';
import { ArticleUsers } from './models/article-users.model';
import { User } from '../users/models/user.model';

@Module({
  providers: [ArticlesService],
  controllers: [ArticlesController],
  imports: [SequelizeModule.forFeature([Tag, Article, ArticleTags, ArticleUsers, User]), AuthModule],
})
export class ArticlesModule {}
