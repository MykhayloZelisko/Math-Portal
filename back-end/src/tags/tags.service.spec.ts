import { Test, TestingModule } from '@nestjs/testing';
import { TagsService } from './tags.service';
import { Tag } from './models/tag.model';
import { getModelToken } from '@nestjs/sequelize';
import { ArticleTags } from '../articles/models/article-tags.model';
import {
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';

describe('TagsService', () => {
  let service: TagsService;
  const mockTagRepository = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    findByPk: jest.fn(),
    destroy: jest.fn(),
  };
  const mockArticleTagRepository = {
    findAll: jest.fn(),
    count: jest.fn(),
  };
  const mockTag: Tag = {
    id: '1a82e47d-6239-4ce8-90cd-99e9a3870ddb',
    value: 'Algebra',
    save: () => {},
  } as Tag;
  const mockTag2: Tag = {
    id: 'bf5415f1-fe74-42fb-bb64-c0976d1f8cad',
    value: 'Geometry',
  } as Tag;
  const mockTagsList: Tag[] = [mockTag, mockTag2];
  const mockQuery: ArticleTags[] = [
    {
      id: 'abf3797c-be09-4fdc-bd34-fa04233609cd',
      articleId: '95ec3bdd-c955-4318-bb03-6e56da9e8adf',
      tagId: '1a82e47d-6239-4ce8-90cd-99e9a3870ddb',
    },
    {
      id: 'bf5415f1-fe74-42fb-bb64-c0976d1f8cad',
      articleId: '6a9599b0-8d32-4289-985d-5fab8d767168',
      tagId: '1a82e47d-6239-4ce8-90cd-99e9a3870ddb',
    },
  ] as ArticleTags[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TagsService,
        {
          provide: getModelToken(Tag),
          useValue: mockTagRepository,
        },
        {
          provide: getModelToken(ArticleTags),
          useValue: mockArticleTagRepository,
        },
      ],
    }).compile();

    service = module.get<TagsService>(TagsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllTags', () => {
    it('should return list of tags', async () => {
      mockTagRepository.findAll.mockResolvedValue(mockTagsList);
      const result = await service.getAllTags();

      expect(result).toEqual(mockTagsList);
    });
  });

  describe('getTagByValue', () => {
    it('should return a tag', async () => {
      mockTagRepository.findOne.mockResolvedValue(mockTag);
      const result = await service.getTagByValue('algebra');

      expect(result).toEqual(mockTag);
    });
  });

  describe('createTag', () => {
    it('should throw conflict exception', async () => {
      jest.spyOn(service, 'getTagByValue').mockResolvedValue(mockTag);
      const result = service.createTag({ value: 'Algebra' });

      await expect(result).rejects.toThrow(
        new ConflictException('Tag already exists'),
      );
    });

    it('should return a tag', async () => {
      jest.spyOn(service, 'getTagByValue').mockResolvedValue(null);
      mockTagRepository.create.mockResolvedValue(mockTag);
      const result = await service.createTag({ value: 'Algebra' });

      expect(result).toEqual(mockTag);
    });
  });

  describe('removeTag', () => {
    it('should throw notfound exception', async () => {
      mockTagRepository.findByPk.mockResolvedValue(null);
      const result = service.removeTag(mockTag.id);

      await expect(result).rejects.toThrow(
        new NotFoundException('Tag not found'),
      );
    });

    it('should throw forbidden exception', async () => {
      mockTagRepository.findByPk.mockResolvedValue(mockTag);
      mockArticleTagRepository.findAll.mockResolvedValue(mockQuery);
      mockArticleTagRepository.count.mockResolvedValue(1);
      const result = service.removeTag(mockTag.id);

      await expect(result).rejects.toThrow(
        new ForbiddenException(
          'A tag cannot be removed while it is in use and is the only tag in the article',
        ),
      );
    });

    it('should remove a tag', async () => {
      mockTagRepository.findByPk.mockResolvedValue(mockTag);
      mockArticleTagRepository.findAll.mockResolvedValue(mockQuery);
      mockArticleTagRepository.count.mockResolvedValue(0);
      await service.removeTag(mockTag.id);

      expect(mockTagRepository.destroy).toHaveBeenCalledWith({
        where: { id: mockTag.id },
      });
    });
  });

  describe('updateTag', () => {
    it('should throw notfound exception', async () => {
      mockTagRepository.findByPk.mockResolvedValue(null);
      const result = service.updateTag(mockTag.id, { value: 'Algebra' });

      await expect(result).rejects.toThrow(
        new NotFoundException('Tag not found'),
      );
    });

    it('should return updated tag', async () => {
      mockTagRepository.findByPk.mockResolvedValue(mockTag);
      jest.spyOn(mockTag, 'save').mockResolvedValue(mockTag);
      const result = await service.updateTag(mockTag.id, { value: 'Algebra' });

      expect(result).toBe(mockTag);
    });
  });
});
