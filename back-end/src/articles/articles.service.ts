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

@Injectable()
export class ArticlesService {
  private articleOptions = {
    include: [
      {
        association: 'tags',
        model: Tag,
        through: { attributes: [] },
      },
    ],
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

  public async getAllArticles() {
    const articles = await this.articleRepository.findAll(this.articleOptions);
    return articles;
  }
}
