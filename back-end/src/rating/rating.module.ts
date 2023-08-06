import { forwardRef, Module } from '@nestjs/common';
import { RatingService } from './rating.service';
import { RatingController } from './rating.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from '../auth/auth.module';
import { Rating } from './models/rating.model';
import { UsersModule } from '../users/users.module';
import { ArticlesModule } from '../articles/articles.module';

@Module({
  providers: [RatingService],
  controllers: [RatingController],
  imports: [
    SequelizeModule.forFeature([Rating]),
    AuthModule,
    forwardRef(() => UsersModule),
    ArticlesModule,
  ],
  exports: [RatingService],
})
export class RatingModule {}
