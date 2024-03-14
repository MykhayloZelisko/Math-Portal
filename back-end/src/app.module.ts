import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { User } from './users/models/user.model';
import { AuthModule } from './auth/auth.module';
import { TagsModule } from './tags/tags.module';
import { Tag } from './tags/models/tag.model';
import { ArticlesModule } from './articles/articles.module';
import { Article } from './articles/models/article.model';
import { ArticleTags } from './articles/models/article-tags.model';
import { RatingModule } from './rating/rating.module';
import { Rating } from './rating/models/rating.model';
import { CommentsModule } from './comments/comments.module';
import { Comment } from './comments/models/comment.model';
import { CommentsTree } from './comments/models/comments-tree.model';
import { FilesModule } from './files/files.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      models: [User, Tag, Article, ArticleTags, Rating, Comment, CommentsTree],
      autoLoadModels: true,
    }),
    UsersModule,
    AuthModule,
    TagsModule,
    ArticlesModule,
    RatingModule,
    CommentsModule,
    FilesModule,
    ServeStaticModule.forRoot({
      rootPath: path.resolve(__dirname, '..', 'static'),
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
