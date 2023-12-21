import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Article } from './models/article.model';
import { Tag } from '../tags/models/tag.model';
import { UpdateArticleDto } from './dto/update-article.dto';
import { TagsService } from '../tags/tags.service';
import sequelize, { FindOptions, Op, QueryTypes, Sequelize } from 'sequelize';
import { CommentsService } from '../comments/comments.service';
import { Comment } from '../comments/models/comment.model';
import * as process from 'process';
import { ArticlesListDto } from './dto/articles-list.dto';

@Injectable()
export class ArticlesService {
  public constructor(
    private tagsService: TagsService,
    @Inject(forwardRef(() => CommentsService))
    private commentsService: CommentsService,
    @InjectModel(Article) private articleRepository: typeof Article,
  ) {}

  public async createArticle(
    createArticleDto: CreateArticleDto,
  ): Promise<Article> {
    const tags = await this.tagsService.getAllTags({
      where: {
        id: createArticleDto.tagsIds,
      },
    });
    if (!tags.length) {
      throw new BadRequestException('Article is not created');
    }
    const article = await this.articleRepository.create({
      title: createArticleDto.title,
      content: createArticleDto.content,
    });
    if (!article) {
      throw new BadRequestException('Article is not created');
    }
    await article.$set('tags', tags);
    return this.getArticleById(article.id);
  }

  public async updateArticle(
    id: string,
    updateArticleDto: UpdateArticleDto,
  ): Promise<Article> {
    const article = await this.getArticleById(id);
    if (!article) {
      throw new NotFoundException('Article not found');
    }
    if (updateArticleDto.tagsIds.length) {
      const tags = await this.tagsService.getAllTags({
        where: {
          id: updateArticleDto.tagsIds,
        },
      });
      if (!tags.length) {
        throw new BadRequestException('Article is not updated');
      }
      article.title = updateArticleDto.title;
      article.content = updateArticleDto.content;
      await article.save();
      await article.$set('tags', tags);
      return this.getArticleById(id);
    }
    throw new BadRequestException('Article is not updated');
  }

  public async removeArticle(id: string): Promise<void> {
    const article = await this.getArticleById(id);
    const comments = await this.commentsService.getAllCommentsByArticleId(id);
    const commentsIds = comments.map((comment: Comment) => comment.id);
    if (article) {
      await this.articleRepository.destroy({ where: { id } });
      await this.commentsService.removeCommentsArray(commentsIds);
      return;
    }
    throw new NotFoundException('Article not found');
  }

  public async getArticleById(id: string): Promise<Article> {
    const article = await this.articleRepository.findByPk(id, {
      include: {
        association: 'tags',
        model: Tag,
        through: { attributes: [] },
      },
    });
    if (article) {
      return article;
    }
    throw new NotFoundException('Article not found');
  }

  public async getAllArticles(
    options?: FindOptions<Article>,
  ): Promise<Article[]> {
    return this.articleRepository.findAll(options);
  }

  public async getAllArticlesWithParams(
    page: number,
    size: number,
    filter: string,
    tagsIds: string[],
  ): Promise<ArticlesListDto> {
    try {
      const sequelizeInstance = new Sequelize(
        String(process.env.POSTGRES_DB),
        String(process.env.POSTGRES_USER),
        process.env.POSTGRES_PASSWORD,
        { dialect: 'postgres' },
      );
      if (!!filter && !!filter.trim() && !!tagsIds.length) {
        const rawQuery = `
          SELECT a.id, a.title, a.content
          FROM articles AS a
          INNER JOIN article_tags AS at
          ON a.id = at.article_id
          WHERE at.tag_id IN (:tagsIds)
          AND (LOWER(a.title) LIKE :filter OR LOWER(a.content) LIKE :filter)
          GROUP BY a.id, a.title, a.content
          HAVING COUNT(DISTINCT at.tag_id) = :tagsCount
          LIMIT :size
          OFFSET :offset
        `;
        const replacements = {
          tagsIds,
          filter: `%${filter.toLowerCase()}%`,
          tagsCount: tagsIds.length,
          size,
          offset: (page - 1) * size,
        };
        const articles = await sequelizeInstance.query(rawQuery, {
          type: QueryTypes.SELECT,
          model: Article,
          mapToModel: true,
          replacements,
        });

        const countQuery = `
          SELECT COUNT(*) AS total
          FROM (
            SELECT a.id
            FROM articles AS a
            INNER JOIN article_tags AS at
            ON a.id = at.article_id
            WHERE at.tag_id IN (:tagsIds)
            AND (LOWER(a.title) LIKE :filter OR LOWER(a.content) LIKE :filter)
            GROUP BY a.id
            HAVING COUNT(DISTINCT at.tag_id) = :tagsCount
          ) AS count_query
        `;
        const countReplacements = {
          tagsIds,
          filter: `%${filter.toLowerCase()}%`,
          tagsCount: tagsIds.length,
        };
        const countResult: { total: number }[] = await sequelizeInstance.query(
          countQuery,
          {
            type: QueryTypes.SELECT,
            replacements: countReplacements,
          },
        );
        const total = Number(countResult[0]?.total) || 0;
        return { total, articles };
      } else if (!!filter && !!filter.trim() && !tagsIds.length) {
        const countOptions: FindOptions<Article> = {
          where: {
            [Op.or]: [
              sequelize.where(
                sequelize.fn('LOWER', sequelize.col('title')),
                'LIKE',
                '%' + filter.trim().toLowerCase() + '%',
              ),
              sequelize.where(
                sequelize.fn('LOWER', sequelize.col('content')),
                'LIKE',
                '%' + filter.trim().toLowerCase() + '%',
              ),
            ],
          },
        };
        const filterOptions = {
          ...countOptions,
          attributes: ['id', 'title', 'content'],
          offset: (page - 1) * size,
          limit: size,
        };

        const articles = await this.getAllArticles(filterOptions);
        const total = await this.articleRepository.count(countOptions);
        return { total, articles };
      } else if ((!filter || !filter.trim()) && !!tagsIds.length) {
        const rawQuery = `
          SELECT a.id, a.title, a.content
          FROM articles AS a
          INNER JOIN article_tags AS at
          ON a.id = at.article_id
          WHERE at.tag_id IN (:tagsIds)
          GROUP BY a.id, a.title, a.content
          HAVING COUNT(DISTINCT at.tag_id) = :tagsCount
          LIMIT :size
          OFFSET :offset
        `;
        const replacements = {
          tagsIds,
          tagsCount: tagsIds.length,
          size,
          offset: (page - 1) * size,
        };
        const articles = await sequelizeInstance.query(rawQuery, {
          type: QueryTypes.SELECT,
          model: Article,
          mapToModel: true,
          replacements,
        });

        const countQuery = `
          SELECT COUNT(*) AS total
          FROM (
            SELECT a.id
            FROM articles AS a
            INNER JOIN article_tags AS at
            ON a.id = at.article_id
            WHERE at.tag_id IN (:tagsIds)
            GROUP BY a.id
            HAVING COUNT(DISTINCT at.tag_id) = :tagsCount
          ) AS count_query
        `;
        const countReplacements = {
          tagsIds,
          tagsCount: tagsIds.length,
        };
        const countResult: { total: number }[] = await sequelizeInstance.query(
          countQuery,
          {
            type: QueryTypes.SELECT,
            replacements: countReplacements,
          },
        );
        const total = Number(countResult[0]?.total) || 0;
        return { total, articles };
      } else {
        const articles = await this.getAllArticles({
          attributes: ['id', 'title', 'content'],
          offset: (page - 1) * size,
          limit: size,
        });
        const total = await this.articleRepository.count();
        return { total, articles };
      }
    } catch (e) {
      throw new InternalServerErrorException('Internal server error');
    }
  }
}
