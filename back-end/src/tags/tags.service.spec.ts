import { Test, TestingModule } from '@nestjs/testing';
import { TagsService } from './tags.service';
import { Tag } from './models/tag.model';
import { getModelToken } from '@nestjs/sequelize';
import { ArticleTags } from '../articles/models/article-tags.model';

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
});
