import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Tag } from './models/tag.model';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import sequelize, { FindOptions, Op } from 'sequelize';
import { ArticleTags } from '../articles/models/article-tags.model';

@Injectable()
export class TagsService {
  public constructor(
    @InjectModel(Tag) private tagRepository: typeof Tag,
    @InjectModel(ArticleTags) private articleTagRepository: typeof ArticleTags,
  ) {}

  public async getAllTags(options?: FindOptions<Tag>) {
    const tags = await this.tagRepository.findAll(options);
    return tags;
  }

  public async getTagByValue(value: string) {
    const tag = await this.tagRepository.findOne({
      where: sequelize.where(
        sequelize.fn('LOWER', sequelize.col('value')),
        'LIKE',
        value.toLowerCase(),
      ),
    });
    return tag;
  }

  public async createTag(createTagDto: CreateTagDto) {
    if (!createTagDto.value) {
      throw new BadRequestException({ message: 'Tag is not created' });
    }
    const tag = await this.getTagByValue(createTagDto.value);
    if (tag) {
      throw new ConflictException({ message: 'Tag already exists' });
    }
    const newTag = await this.tagRepository.create(createTagDto);
    if (newTag) {
      return newTag;
    }
    throw new BadRequestException({ message: 'Tag is not created' });
  }

  public async removeTag(id: number) {
    const tag = await this.tagRepository.findByPk(id);
    if (tag) {
      const subQuery = await this.articleTagRepository.findAll({
        attributes: ['articleId'],
        where: {
          tagId: {
            [Op.ne]: id,
          },
        },
      });

      const excludedArticleIds = subQuery.map((row: ArticleTags) => row.articleId);

      const count = await this.articleTagRepository.count({
        distinct: true,
        col: 'article_id',
        where: {
          articleId: {
            [Op.notIn]: excludedArticleIds,
          },
        },
      });
      if (count) {
        throw new ForbiddenException({
          message: 'A tag cannot be removed while it is in use and is the only tag in the article',
        });
      } else {
        await this.tagRepository.destroy({ where: { id } });
        return;
      }
    }
    throw new NotFoundException({ message: 'Tag not found' });
  }

  public async updateTag(tagId: number, updateTagDto: UpdateTagDto) {
    if (!updateTagDto.value) {
      throw new BadRequestException({ message: 'Tag is not updated' });
    }
    const tag = await this.tagRepository.findByPk(tagId);
    if (tag) {
      tag.value = updateTagDto.value;
      const newTag = await tag.save();
      if (!newTag) {
        throw new BadRequestException({ message: 'Tag is not updated' });
      }
      return tag;
    }
    throw new NotFoundException({ message: 'Tag not found' });
  }
}
