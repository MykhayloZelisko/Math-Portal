import { Test, TestingModule } from '@nestjs/testing';
import { ArticlesService } from './articles.service';
import { TagsService } from '../tags/tags.service';
import { CommentsService } from '../comments/comments.service';
import { getModelToken } from '@nestjs/sequelize';
import { Article } from './models/article.model';

describe('ArticlesService', () => {
  let service: ArticlesService;
  const mockTagsService = {
    getAllTags: jest.fn(),
  };
  const mockCommentsService = {
    getAllCommentsByArticleId: jest.fn(),
    removeCommentsArray: jest.fn(),
  };
  const mockArticleRepository = {
    findAll: jest.fn(),
    create: jest.fn(),
    findByPk: jest.fn(),
    destroy: jest.fn(),
    count: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArticlesService,
        { provide: TagsService, useValue: mockTagsService },
        { provide: CommentsService, useValue: mockCommentsService },
        { provide: getModelToken(Article), useValue: mockArticleRepository },
      ],
    }).compile();

    service = module.get<ArticlesService>(ArticlesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
