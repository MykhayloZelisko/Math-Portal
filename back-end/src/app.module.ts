import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import * as process from 'process';
import { User } from './users/models/user.model';
import { AuthModule } from './auth/auth.module';
import { TagsModule } from './tags/tags.module';
import { Tag } from './tags/models/tag.model';
import { ArticlesModule } from './articles/articles.module';
import { Article } from './articles/models/article.model';
import { ArticleTags } from './articles/models/article-tags.model';
import { ArticleUsers } from './articles/models/article-users.model';
import { RatingModule } from './rating/rating.module';
import { Rating } from './rating/models/rating.model';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: +process.env.POSTGRES_PORT,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      models: [User, Tag, Article, ArticleTags, ArticleUsers, Rating],
      autoLoadModels: true,
    }),
    UsersModule,
    AuthModule,
    TagsModule,
    ArticlesModule,
    RatingModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
