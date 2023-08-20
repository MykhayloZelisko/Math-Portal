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
  articleId: string;
  userId: string;
  rate: number;
}

@Table({
  tableName: 'ratings',
  createdAt: false,
  updatedAt: false,
  underscored: true,
})
export class Rating extends Model<Rating, RatingCreationAttrsInterface> {
  @ApiProperty({ example: '68f48b22-8104-4b47-b846-3db152d8b0ee', description: 'Unique identifier' })
  @Column({
    type: DataType.UUID,
    unique: true,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  public id: string;

  @ApiProperty({ example: 5, description: 'Rating' })
  @Column({ type: DataType.INTEGER, allowNull: false })
  public rate: 0 | 1 | 2 | 3 | 4 | 5;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false })
  public userId: string;

  @BelongsTo(() => User)
  public user: User;

  @ForeignKey(() => Article)
  @Column({ type: DataType.UUID, allowNull: false })
  public articleId: string;

  @BelongsTo(() => Article)
  public article: Article;
}
