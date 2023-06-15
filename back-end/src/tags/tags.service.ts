import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Tag } from './models/tag.model';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

@Injectable()
export class TagsService {
  public constructor(@InjectModel(Tag) private tagRepository: typeof Tag) {}

  public async getAllTags() {
    const tags = await this.tagRepository.findAll();
    if (tags) {
      return tags;
    }
    throw new BadRequestException({ message: 'Tags not found' });
  }

  public async createTag(createTagDto: CreateTagDto) {
    const tag = await this.tagRepository.create(createTagDto);
    if (tag) {
      return tag;
    }
    throw new BadRequestException({ message: 'Tag not created' });
  }

  public async removeTag(id: number) {
    const tag = await this.tagRepository.findByPk(id);
    if (tag) {
      await this.tagRepository.destroy({ where: { id } });
      return;
    }
    throw new BadRequestException({ message: 'Tag not found' });
  }

  public async updateTag(tagId: number, updateTagDto: UpdateTagDto) {
    const tag = await this.tagRepository.findByPk(tagId);
    if (tag) {
      tag.value = updateTagDto.value;
      await tag.save();
      return tag;
    }
    throw new BadRequestException({ message: 'Tag not found' });
  }
}
