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
  ancestorId: string;
  nearestAncestorId: string | null;
  descendantId: string;
  level: number;
  articleId: string;
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
  @ApiProperty({
    example: '68f48b22-8104-4b47-b846-3db152d8b0ee',
    description: 'Unique identifier',
  })
  @Column({
    type: DataType.UUID,
    unique: true,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  public id: string;

  @ForeignKey(() => Comment)
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
  })
  public ancestorId: string;

  @Column({ type: DataType.UUID, defaultValue: null })
  public nearestAncestorId: string | null;

  @ForeignKey(() => Comment)
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
  })
  public descendantId: string;

  @Column({ type: DataType.SMALLINT, defaultValue: 1, allowNull: false })
  public level: number;

  @ForeignKey(() => Article)
  @Column({ type: DataType.UUID, allowNull: false })
  public articleId: string;

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
