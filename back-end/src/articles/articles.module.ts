import { Module } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { ArticlesController } from './articles.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Article } from './models/article.model';
import { AuthModule } from '../auth/auth.module';
import { ArticleTags } from './models/article-tags.model';
import { ArticleUsers } from './models/article-users.model';
import { TagsModule } from '../tags/tags.module';
import { UsersModule } from '../users/users.module';

@Module({
  providers: [ArticlesService],
  controllers: [ArticlesController],
  imports: [
    SequelizeModule.forFeature([Article, ArticleTags, ArticleUsers]),
    AuthModule,
    TagsModule,
    UsersModule,
  ],
  exports: [ArticlesService],
})
export class ArticlesModule {}
