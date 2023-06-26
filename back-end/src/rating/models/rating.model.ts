import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/models/user.model';
import { Article } from '../../articles/models/article.model';

interface RatingCreationAttrsInterface {
  rate: number;
}

@Table({
  tableName: 'ratings',
  createdAt: false,
  updatedAt: false,
  underscored: true,
})
export class Rating extends Model<Rating, RatingCreationAttrsInterface> {
  @ApiProperty({ example: 1, description: 'Unique identifier' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  public id: number;

  @ApiProperty({ example: 5, description: 'Rating' })
  @Column({ type: DataType.INTEGER, allowNull: false })
  public rate: 0 | 1 | 2 | 3 | 4 | 5;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  public userId: number;

  @BelongsTo(() => User)
  public user: User;

  @ForeignKey(() => Article)
  @Column({ type: DataType.INTEGER, allowNull: false })
  public articleId: number;

  @BelongsTo(() => Article)
  public article: Article;
}
