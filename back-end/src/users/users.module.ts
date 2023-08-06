import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './models/user.model';
import { AuthModule } from '../auth/auth.module';
import { FilesModule } from '../files/files.module';
import { RatingModule } from '../rating/rating.module';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [
    SequelizeModule.forFeature([User]),
    forwardRef(() => AuthModule),
    FilesModule,
    RatingModule,
  ],
  exports: [UsersService],
})
export class UsersModule {}
