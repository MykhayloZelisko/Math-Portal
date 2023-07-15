import {
  BelongsToMany,
  Column,
  DataType,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { Tag } from '../../tags/models/tag.model';
import { ArticleTags } from './article-tags.model';
import { Rating } from '../../rating/models/rating.model';
import { CommentsTree } from '../../comments/models/comments-tree.model';

interface ArticleCreationAttrsInterface {
  title: string;
  content: string;
}

@Table({
  tableName: 'articles',
  createdAt: false,
  updatedAt: false,
  underscored: true,
})
export class Article extends Model<Article, ArticleCreationAttrsInterface> {
  @ApiProperty({ example: 1, description: 'Unique identifier' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  public id: number;

  @ApiProperty({ example: 'Title', description: 'Title' })
  @Column({ type: DataType.STRING, allowNull: false })
  public title: string;

  @ApiProperty({ example: 'Text', description: 'Text' })
  @Column({ type: DataType.TEXT, allowNull: false })
  public content: string;

  @ApiProperty({ example: 0, description: 'Rating' })
  @Column({ type: DataType.FLOAT, allowNull: false, defaultValue: 0 })
  public rating: number;

  @BelongsToMany(() => Tag, () => ArticleTags)
  public tags: Tag[];

  @HasMany(() => Rating)
  public ratings: Rating[];

  @HasMany(() => CommentsTree)
  public comments: CommentsTree[];
}
