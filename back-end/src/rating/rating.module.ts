import { Module } from '@nestjs/common';
import { RatingService } from './rating.service';
import { RatingController } from './rating.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from '../auth/auth.module';
import { Rating } from './models/rating.model';
import { User } from '../users/models/user.model';
import { Article } from '../articles/models/article.model';

@Module({
  providers: [RatingService],
  controllers: [RatingController],
  imports: [SequelizeModule.forFeature([Rating, User, Article]), AuthModule],
})
export class RatingModule {}
