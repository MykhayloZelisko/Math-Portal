import {
  BelongsToMany,
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { Article } from '../../articles/models/article.model';
import { ArticleTags } from '../../articles/models/article-tags.model';

interface TagCreationAttrsInterface {
  value: string;
}

@Table({
  tableName: 'tags',
  createdAt: false,
  updatedAt: false,
  underscored: true,
})
export class Tag extends Model<Tag, TagCreationAttrsInterface> {
  @ApiProperty({ example: '68f48b22-8104-4b47-b846-3db152d8b0ee', description: 'Unique identifier' })
  @Column({
    type: DataType.UUID,
    unique: true,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  public id: string;

  @ApiProperty({ example: 'algebra', description: "tag's name" })
  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  public value: string;

  @BelongsToMany(() => Article, () => ArticleTags)
  public articles: Article[];
}
