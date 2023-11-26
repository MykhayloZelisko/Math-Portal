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
  userId: string;
}

@Table({ tableName: 'comments', underscored: true })
export class Comment extends Model<Comment, CommentCreationAttrsInterface> {
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

  @ApiProperty({ example: 'Comment', description: 'Content' })
  @Column({ type: DataType.STRING, allowNull: false })
  public content: string;

  @ApiProperty({
    example: ['68f48b22-8104-4b47-b846-3db152d8b0ee'],
    description: 'Array of user ids who liked the comment',
  })
  @Column({
    type: DataType.ARRAY(DataType.UUID),
    allowNull: false,
    defaultValue: [],
  })
  public likesUsersIds: string[];

  @ApiProperty({
    example: ['68f48b22-8104-4b47-b846-3db152d8b0ee'],
    description: 'Array of user ids who disliked the comment',
  })
  @Column({
    type: DataType.ARRAY(DataType.UUID),
    allowNull: false,
    defaultValue: [],
  })
  public dislikesUsersIds: string[];

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false })
  public userId: string;

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
