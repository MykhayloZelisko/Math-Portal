import {
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

  public async getAllTags(options?: FindOptions<Tag>): Promise<Tag[]> {
    return this.tagRepository.findAll(options);
  }

  public async getTagByValue(value: string): Promise<Tag | null> {
    return this.tagRepository.findOne({
      where: sequelize.where(
        sequelize.fn('LOWER', sequelize.col('value')),
        'LIKE',
        value.toLowerCase(),
      ),
    });
  }

  public async createTag(createTagDto: CreateTagDto): Promise<Tag> {
    const tag = await this.getTagByValue(createTagDto.value);
    if (tag) {
      throw new ConflictException('Tag already exists');
    }
    return this.tagRepository.create(createTagDto);
  }

  public async removeTag(id: string): Promise<void> {
    const tag = await this.tagRepository.findByPk(id);
    if (!tag) {
      throw new NotFoundException('Tag not found');
    }

    const subQuery = await this.articleTagRepository.findAll({
      attributes: ['articleId'],
      where: {
        tagId: {
          [Op.ne]: id,
        },
      },
    });

    const excludedArticleIds = subQuery.map(
      (row: ArticleTags) => row.articleId,
    );

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
      throw new ForbiddenException(
        'A tag cannot be removed while it is in use and is the only tag in the article',
      );
    } else {
      await this.tagRepository.destroy({ where: { id } });
    }
  }

  public async updateTag(
    tagId: string,
    updateTagDto: UpdateTagDto,
  ): Promise<Tag> {
    const tag = await this.tagRepository.findByPk(tagId);
    if (!tag) {
      throw new NotFoundException('Tag not found');
    }
    tag.value = updateTagDto.value;
    await tag.save();
    return tag;
  }
}
