import {
  BelongsToMany,
  Column,
  DataType,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { Article } from '../../articles/models/article.model';
import { ArticleUsers } from '../../articles/models/article-users.model';
import { Rating } from '../../rating/models/rating.model';
import { Comment } from '../../comments/models/comment.model';

interface UserCreationAttrsInterface {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

@Table({
  tableName: 'users',
  createdAt: false,
  updatedAt: false,
  underscored: true,
})
export class User extends Model<User, UserCreationAttrsInterface> {
  @ApiProperty({ example: 1, description: 'Unique identifier' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  public id: number;

  @ApiProperty({ example: 'John', description: 'First name' })
  @Column({ type: DataType.STRING, allowNull: false })
  public firstName: string;

  @ApiProperty({ example: 'Doe', description: 'Last name' })
  @Column({ type: DataType.STRING, allowNull: false })
  public lastName: string;

  @ApiProperty({ example: 'email@mail.com', description: 'Email' })
  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  public email: string;

  @ApiProperty({ example: 'q1we5?!ER234', description: 'Password' })
  @Column({ type: DataType.STRING, allowNull: false })
  public password: string;

  @ApiProperty({ example: false, description: 'User is an admin or not' })
  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
  public isAdmin: boolean;

  @BelongsToMany(() => Article, () => ArticleUsers)
  public articles: Article[];

  @HasMany(() => Rating)
  public ratings: Rating[];

  @HasMany(() => Comment)
  public comments: Comment[];
}
