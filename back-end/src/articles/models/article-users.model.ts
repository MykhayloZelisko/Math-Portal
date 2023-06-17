import { Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { Tag } from '../../tags/models/tag.model';
import { Article } from './article.model';
import { User } from '../../users/models/user.model';

@Table({ tableName: 'article_users', createdAt: false, updatedAt: false })
export class ArticleUsers extends Model<ArticleUsers> {
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

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER })
  public userId: number;
}
