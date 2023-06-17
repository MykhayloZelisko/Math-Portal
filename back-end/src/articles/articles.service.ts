import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Article } from './models/article.model';
import { Tag } from '../tags/models/tag.model';
import { User } from '../users/models/user.model';
import { UpdateArticleDto } from './dto/update-article.dto';

@Injectable()
export class ArticlesService {
  private articleOptions = {
    include: [
      {
        association: 'tags',
        model: Tag,
        through: { attributes: [] }
      },
      {
        association: 'users',
        model: User,
        through: { attributes: [] }
      }
    ]
  }
  public constructor(
    @InjectModel(Article) private articleRepository: typeof Article,
    @InjectModel(Tag) private tagRepository: typeof Tag,
    @InjectModel(User) private userRepository: typeof User,
  ) {}

  public async createArticle(createArticleDto: CreateArticleDto) {
    if (!createArticleDto.title || !createArticleDto.text || !createArticleDto.usersIds || !createArticleDto.tagsIds) {
      throw new BadRequestException({ message: 'Article is not created' });
    }
    const tags = await this.tagRepository.findAll({
      where: {
        id: createArticleDto.tagsIds
      }
    });
    const users = await this.userRepository.findAll({
      where: {
        id: createArticleDto.usersIds
      }
    });
    if (!users.length || !tags.length) {
      throw new BadRequestException({ message: 'Article is not created' });
    }
    const article = await this.articleRepository.create({
      title: createArticleDto.title,
      text: createArticleDto.text,
    });
    if (!article) {
      throw new BadRequestException({ message: 'Article is not created' });
    }
    await article.$set('tags', tags);
    await article.$set('users', users);
    return await this.articleRepository.findByPk(article.id, this.articleOptions);
  }

  public async updateArticle(id: number, updateArticleDto: UpdateArticleDto) {
    if (!updateArticleDto.title || !updateArticleDto.text || !updateArticleDto.usersIds || !updateArticleDto.tagsIds) {
      throw new BadRequestException({ message: 'Article is not updated' });
    }
    const article = await this.articleRepository.findByPk(id);
    if (!article) {
      throw new NotFoundException({ message: 'Article not found' });
    }
    if (updateArticleDto.tagsIds.length && updateArticleDto.usersIds.length) {
      const tags = await this.tagRepository.findAll({
        where: {
          id: updateArticleDto.tagsIds
        }
      });
      const users = await this.userRepository.findAll({
        where: {
          id: updateArticleDto.usersIds
        }
      });
      if (!users.length || !tags.length) {
        throw new BadRequestException({ message: 'Article is not updated' });
      }
      article.title = updateArticleDto.title;
      article.text = updateArticleDto.text;
      await article.save();
      await article.$set('tags', tags);
      await article.$set('users', users);
      return await this.articleRepository.findByPk(article.id, this.articleOptions);
    }
    throw new BadRequestException({ message: 'Article is not updated' });
  }

  public async removeArticle(id: number) {
    const article = await this.articleRepository.findByPk(id);
    if (article) {
      await this.tagRepository.destroy({ where: { id } });
      return;
    }
    throw new NotFoundException({ message: 'Article not found' });
  }

  public async getArticle(id: number) {
    const article = await this.articleRepository.findByPk(id, this.articleOptions);
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
