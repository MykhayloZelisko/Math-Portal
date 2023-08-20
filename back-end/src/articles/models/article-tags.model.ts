import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Tag } from '../../tags/models/tag.model';
import { Article } from './article.model';
import { ApiProperty } from '@nestjs/swagger';

@Table({
  tableName: 'article_tags',
  createdAt: false,
  updatedAt: false,
  underscored: true,
})
export class ArticleTags extends Model<ArticleTags> {
  @ApiProperty({ example: '68f48b22-8104-4b47-b846-3db152d8b0ee', description: 'Unique identifier' })
  @Column({
    type: DataType.UUID,
    unique: true,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  public id: string;

  @ForeignKey(() => Article)
  @Column({ type: DataType.INTEGER })
  public articleId: number;

  @ForeignKey(() => Tag)
  @Column({ type: DataType.INTEGER })
  public tagId: number;
}
