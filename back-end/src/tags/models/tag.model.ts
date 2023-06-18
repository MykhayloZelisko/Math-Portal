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

@Table({ tableName: 'tags', createdAt: false, updatedAt: false })
export class Tag extends Model<Tag, TagCreationAttrsInterface> {
  @ApiProperty({ example: 1, description: 'Unique identifier' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  public id: number;

  @ApiProperty({ example: 'algebra', description: "tag's name" })
  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  public value: string;

  @BelongsToMany(() => Article, () => ArticleTags)
  public articles: Article[];
}
