import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import * as process from 'process';
import { User } from './users/models/user.model';
import { AuthModule } from './auth/auth.module';
import { TagsModule } from './tags/tags.module';
import { Tag } from './tags/models/tag.model';

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
      models: [User, Tag],
      autoLoadModels: true,
    }),
    UsersModule,
    AuthModule,
    TagsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
