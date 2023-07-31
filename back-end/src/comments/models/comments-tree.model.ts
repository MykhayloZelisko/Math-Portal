import {
  Table,
  Column,
  Model,
  BelongsTo,
  DataType,
  ForeignKey,
} from 'sequelize-typescript';
import { Comment } from './comment.model';
import { Article } from '../../articles/models/article.model';
import { ApiProperty } from '@nestjs/swagger';

interface TreeCreationAttrsInterface {
  ancestorId: number;
  nearestAncestorId: number;
  descendantId: number;
  level: number;
  articleId: number;
}

@Table({
  tableName: 'comments_tree',
  createdAt: false,
  updatedAt: false,
  underscored: true,
})
export class CommentsTree extends Model<
  CommentsTree,
  TreeCreationAttrsInterface
> {
  @ApiProperty({ example: 1, description: 'Unique identifier' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  public id: number;

  @ForeignKey(() => Comment)
  @Column({ type: DataType.INTEGER, defaultValue: 0, allowNull: false })
  public ancestorId: number;

  @Column({ type: DataType.INTEGER, defaultValue: 0, allowNull: false })
  public nearestAncestorId: number;

  @ForeignKey(() => Comment)
  @Column({ type: DataType.INTEGER, defaultValue: 0, allowNull: false })
  public descendantId: number;

  @Column({ type: DataType.SMALLINT, defaultValue: 1, allowNull: false })
  public level: number;

  @ForeignKey(() => Article)
  @Column({ type: DataType.INTEGER, allowNull: false })
  public articleId: number;

  @BelongsTo(() => Comment, {
    foreignKey: 'ancestorId',
    as: 'descendantsList',
  })
  public ancestor: Comment;

  @BelongsTo(() => Comment, {
    foreignKey: 'descendantId',
    as: 'ancestorsList',
  })
  public descendant: Comment;

  @BelongsTo(() => Article)
  public article: Article;
}
