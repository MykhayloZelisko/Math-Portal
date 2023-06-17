import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './models/user.model';
import { AuthModule } from '../auth/auth.module';
import { ArticleUsers } from '../articles/models/article-users.model';
import { Article } from '../articles/models/article.model';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [SequelizeModule.forFeature([User, ArticleUsers, Article]), forwardRef(() => AuthModule)],
  exports: [UsersService],
})
export class UsersModule {}
