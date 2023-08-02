import { forwardRef, Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from '../auth/auth.module';
import { CommentsTree } from './models/comments-tree.model';
import { Comment } from './models/comment.model';
import { ArticlesModule } from '../articles/articles.module';
import { UsersModule } from '../users/users.module';

@Module({
  controllers: [CommentsController],
  providers: [CommentsService],
  imports: [
    SequelizeModule.forFeature([Comment, CommentsTree]),
    AuthModule,
    forwardRef(() => ArticlesModule),
    UsersModule,
  ],
  exports: [CommentsService],
})
export class CommentsModule {}
