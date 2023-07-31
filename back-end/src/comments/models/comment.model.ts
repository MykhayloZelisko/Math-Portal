import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/models/user.model';
import { CommentsTree } from './comments-tree.model';

interface CommentCreationAttrsInterface {
  content: string;
  userId: number;
}

@Table({ tableName: 'comments', underscored: true })
export class Comment extends Model<Comment, CommentCreationAttrsInterface> {
  @ApiProperty({ example: 1, description: 'Unique identifier' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  public id: number;

  @ApiProperty({ example: 'Comment', description: 'Content' })
  @Column({ type: DataType.STRING, allowNull: false })
  public content: string;

  @ApiProperty({
    example: [1, 2, 5],
    description: 'Array of user ids who liked the comment',
  })
  @Column({
    type: DataType.ARRAY(DataType.INTEGER),
    allowNull: false,
    defaultValue: [],
  })
  public likesUsersIds: number[];

  @ApiProperty({
    example: [1, 2, 5],
    description: 'Array of user ids who disliked the comment',
  })
  @Column({
    type: DataType.ARRAY(DataType.INTEGER),
    allowNull: false,
    defaultValue: [],
  })
  public dislikesUsersIds: number[];

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  public userId: number;

  @BelongsTo(() => User)
  public user: User;

  @HasMany(() => CommentsTree, {
    foreignKey: 'descendantId',
    as: 'ancestorsList',
  })
  public ancestors: CommentsTree[];

  @HasMany(() => CommentsTree, {
    foreignKey: 'ancestorId',
    as: 'descendantsList',
  })
  public descendants: CommentsTree[];
}
