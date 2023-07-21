import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Article } from './models/article.model';
import { Tag } from '../tags/models/tag.model';
import { UpdateArticleDto } from './dto/update-article.dto';
import { TagsService } from '../tags/tags.service';
import sequelize, { FindOptions, Op } from 'sequelize';

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
    if (article) {
      await this.articleRepository.destroy({ where: { id } });
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
    // page: number,
    // size: number,
    filter: string,
    tagsIds: number[],
  ) {
    let filterOptions: FindOptions<Article>;

    if (!!filter && !!filter.trim() && !!tagsIds.length) {
      filterOptions = {
        attributes: ['id', 'title'],
        include: {
          attributes: [],
          association: 'tags',
          model: Tag,
          through: { attributes: [] },
          where: { id: tagsIds },
          required: true,
        },
        where: {
          [Op.or]: [
            sequelize.where(
              sequelize.fn('LOWER', sequelize.col('title')),
              'LIKE',
              '%' + filter.toLowerCase() + '%',
            ),
            sequelize.where(
              sequelize.fn('LOWER', sequelize.col('content')),
              'LIKE',
              '%' + filter.toLowerCase() + '%',
            ),
          ],
        },
        group: ['Article.id', 'Article.title'],
        having: sequelize.literal(`COUNT(tags.id) = ${tagsIds.length}`),
        // offset: (page - 1) * size,
        // limit: size,
      };
    } else if (!!filter && !!filter.trim() && !tagsIds.length) {
      filterOptions = {
        attributes: ['id', 'title'],
        where: {
          [Op.or]: [
            sequelize.where(
              sequelize.fn('LOWER', sequelize.col('title')),
              'LIKE',
              '%' + filter.toLowerCase() + '%',
            ),
            sequelize.where(
              sequelize.fn('LOWER', sequelize.col('content')),
              'LIKE',
              '%' + filter.toLowerCase() + '%',
            ),
          ],
        },
        // offset: (page - 1) * size,
        // limit: size,
      };
    } else if ((!filter || !filter.trim()) && !!tagsIds.length) {
      filterOptions = {
        attributes: ['id', 'title'],
        include: {
          attributes: [],
          association: 'tags',
          model: Tag,
          through: { attributes: [] },
          where: { id: tagsIds },
          required: true,
        },
        group: ['Article.id', 'Article.title'],
        having: sequelize.literal(`COUNT(tags.id) = ${tagsIds.length}`),
        // offset: (page - 1) * size,
        // limit: size,
      };
    } else {
      filterOptions = {
        attributes: ['id', 'title'],
        // offset: (page - 1) * size,
        // limit: size,
      };
    }

    const articles = await this.getAllArticles(filterOptions);
    return articles;
  }
}
