import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable, InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Article } from './models/article.model';
import { Tag } from '../tags/models/tag.model';
import { UpdateArticleDto } from './dto/update-article.dto';
import { TagsService } from '../tags/tags.service';
import { FindOptions, QueryTypes } from 'sequelize';
import { CommentsService } from '../comments/comments.service';
import { Comment } from '../comments/models/comment.model';
import { Sequelize } from 'sequelize-typescript';
import * as process from 'process';

@Injectable()
export class ArticlesService {
  private articleOptions: FindOptions<Article> = {
    include: {
      association: 'tags',
      model: Tag,
      through: { attributes: [] },
    },
  };

  public constructor(
    private tagsService: TagsService,
    @Inject(forwardRef(() => CommentsService))
    private commentsService: CommentsService,
    @InjectModel(Article) private articleRepository: typeof Article,
  ) {}

  public async createArticle(createArticleDto: CreateArticleDto) {
    if (
      !createArticleDto.title ||
      !createArticleDto.content ||
      !createArticleDto.tagsIds
    ) {
      throw new BadRequestException({ message: 'Article is not created' });
    }
    const tags = await this.tagsService.getAllTags({
      where: {
        id: createArticleDto.tagsIds,
      },
    });
    if (!tags.length) {
      throw new BadRequestException({ message: 'Article is not created' });
    }
    const article = await this.articleRepository.create({
      title: createArticleDto.title,
      content: createArticleDto.content,
    });
    if (!article) {
      throw new BadRequestException({ message: 'Article is not created' });
    }
    await article.$set('tags', tags);
    return this.getArticleById(article.id);
  }

  public async updateArticle(id: number, updateArticleDto: UpdateArticleDto) {
    if (
      !updateArticleDto.title ||
      !updateArticleDto.content ||
      !updateArticleDto.tagsIds
    ) {
      throw new BadRequestException({ message: 'Article is not updated' });
    }
    const article = await this.getArticleById(id);
    if (!article) {
      throw new NotFoundException({ message: 'Article not found' });
    }
    if (updateArticleDto.tagsIds.length) {
      const tags = await this.tagsService.getAllTags({
        where: {
          id: updateArticleDto.tagsIds,
        },
      });
      if (!tags.length) {
        throw new BadRequestException({ message: 'Article is not updated' });
      }
      article.title = updateArticleDto.title;
      article.content = updateArticleDto.content;
      await article.save();
      await article.$set('tags', tags);
      return this.getArticleById(id);
    }
    throw new BadRequestException({ message: 'Article is not updated' });
  }

  public async removeArticle(id: number) {
    const article = await this.getArticleById(id);
    const comments = await this.commentsService.getAllComments(id);
    const commentsIds = comments.map((comment: Comment) => comment.id);
    if (article) {
      await this.articleRepository.destroy({ where: { id } });
      await this.commentsService.removeCommentsArray(commentsIds);
      return;
    }
    throw new NotFoundException({ message: 'Article not found' });
  }

  public async getArticleById(id: number) {
    const article = await this.articleRepository.findByPk(
      id,
      this.articleOptions,
    );
    if (article) {
      return article;
    }
    throw new NotFoundException({ message: 'Article not found' });
  }

  public async getAllArticles(options?: FindOptions<Article>) {
    const articles = await this.articleRepository.findAll(options);
    return articles;
  }

  public async getAllArticlesWithParams(
    page: number,
    size: number,
    filter: string,
    tagsIds: number[],
  ) {
    try {
      const sequelize = new Sequelize(
        process.env.POSTGRES_DB,
        process.env.POSTGRES_USER,
        process.env.POSTGRES_PASSWORD,
        { dialect: 'postgres' });
      if (!!filter && !!filter.trim() && !!tagsIds.length) {
        const rawQuery = `
          SELECT a.id, a.title, a.content
          FROM articles AS a
          INNER JOIN article_tags AS at
          ON a.id = at.article_id
          WHERE at.tag_id IN (:tagsIds)
          AND (a.title LIKE :filter OR a.content LIKE :filter)
          GROUP BY a.id, a.title, a.content
          HAVING COUNT(DISTINCT at.tag_id) = :tagsCount
          LIMIT :size
          OFFSET :offset
        `;
        const replacements = {
          tagsIds,
          filter: `%${filter}%`,
          tagsCount: tagsIds.length,
          size,
          offset: (page - 1) * size,
        };
        const articles = await sequelize.query(rawQuery, {
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
            AND (a.title LIKE :filter OR a.content LIKE :filter)
            GROUP BY a.id
            HAVING COUNT(DISTINCT at.tag_id) = :tagsCount
          ) AS count_query
        `;
        const countReplacements = {
          tagsIds,
          filter: `%${filter}%`,
          tagsCount: tagsIds.length,
        };
        const countResult: {total: number}[] = await sequelize.query(countQuery, {
          type: QueryTypes.SELECT,
          replacements: countReplacements,
        });
        const total = Number(countResult[0]?.total) || 0;

        return { total, articles };
      } else if (!!filter && !!filter.trim() && !tagsIds.length) {
        const rawQuery = `
          SELECT a.id, a.title, a.content
          FROM articles AS a
          WHERE a.title LIKE :filter OR a.content LIKE :filter
          GROUP BY a.id, a.title, a.content
          LIMIT :size
          OFFSET :offset
        `;
        const replacements = {
          filter: `%${filter}%`,
          size,
          offset: (page - 1) * size,
        };
        const articles = await sequelize.query(rawQuery, {
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
            WHERE a.title LIKE :filter OR a.content LIKE :filter
            GROUP BY a.id
          ) AS count_query
        `;
        const countReplacements = {
          filter: `%${filter}%`,
        };
        const countResult: {total: number}[] = await sequelize.query(countQuery, {
          type: QueryTypes.SELECT,
          replacements: countReplacements,
        });
        const total = Number(countResult[0]?.total) || 0;

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
        const articles = await sequelize.query(rawQuery, {
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
        const countResult: {total: number}[] = await sequelize.query(countQuery, {
          type: QueryTypes.SELECT,
          replacements: countReplacements,
        });
        const total = Number(countResult[0]?.total) || 0;

        return { total, articles };
      } else {
        const rawQuery = `
          SELECT a.id, a.title, a.content
          FROM articles AS a
          LIMIT :size
          OFFSET :offset
        `;
        const replacements = {
          size,
          offset: (page - 1) * size,
        };
        const articles = await sequelize.query(rawQuery, {
          type: QueryTypes.SELECT,
          model: Article,
          mapToModel: true,
          replacements,
        });

        const countQuery = `
          SELECT COUNT(*) AS total
          FROM (
            SELECT a.id, a.title, a.content
            FROM articles AS a
          ) AS count_query
        `;
        const countResult: {total: number}[] = await sequelize.query(countQuery, {
          type: QueryTypes.SELECT,
        });
        const total = Number(countResult[0]?.total) || 0;

        return { total, articles };
      }
    } catch (e) {
      throw new InternalServerErrorException({ message: 'Internal server error' })
    }
  }
}
