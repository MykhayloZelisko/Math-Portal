import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Tag } from '../../tags/models/tag.model';
import { Article } from './article.model';

@Table({ tableName: 'article_tags', createdAt: false, updatedAt: false })
export class ArticleTags extends Model<ArticleTags> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  public id: number;

  @ForeignKey(() => Article)
  @Column({ type: DataType.INTEGER })
  public articleId: number;

  @ForeignKey(() => Tag)
  @Column({ type: DataType.INTEGER })
  public tagId: number;
}
