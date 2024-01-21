import { Test, TestingModule } from '@nestjs/testing';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';
import { AdminGuard } from '../auth/guards/admin/admin.guard';
import { Tag } from '../tags/models/tag.model';
import { Article } from './models/article.model';
import { ArticlesListDto } from './dto/articles-list.dto';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

describe('ArticlesController', () => {
  let controller: ArticlesController;
  const mockArticlesService = {
    createArticle: jest.fn(),
    updateArticle: jest.fn(),
    removeArticle: jest.fn(),
    getArticleById: jest.fn(),
    getAllArticlesWithParams: jest.fn(),
  };
  const mockAdminGuard = {
    canActivate: jest.fn(),
  };
  const mockArticle: Article = {
    id: '53ef5af1-581a-4e3f-abfb-a7e31c4d1890',
    title: 'Title',
    content: 'Text',
    rating: 0,
    votes: 0,
    tags: [
      {
        id: '68f48b22-8104-4b47-b846-3db152d8b0ee',
        value: 'Tag',
      },
    ] as Tag[],
  } as Article;
  const mockArticle2: Article = {
    id: '3135cc3e-a999-49b6-a867-813a754ec809',
    title: 'Title',
    content: 'Text',
    rating: 0,
    votes: 0,
    tags: [
      {
        id: '6869d59c-1858-46a2-b8ff-273f29e4566e',
        value: 'Tag 2',
      },
      {
        id: '68f48b22-8104-4b47-b846-3db152d8b0ee',
        value: 'Tag',
      },
    ] as Tag[],
  } as Article;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArticlesController],
      providers: [{ provide: ArticlesService, useValue: mockArticlesService }],
    })
      .overrideGuard(AdminGuard)
      .useValue(mockAdminGuard)
      .compile();

    controller = module.get<ArticlesController>(ArticlesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createArticle', () => {
    it('should create article', async () => {
      mockArticlesService.createArticle.mockResolvedValue(mockArticle);
      const mockDto: CreateArticleDto = {
        title: 'Title',
        content: 'Text',
        tagsIds: ['68f48b22-8104-4b47-b846-3db152d8b0ee'],
      };
      const result = await controller.createArticle(mockDto);

      expect(result).toEqual(mockArticle);
      expect(mockArticlesService.createArticle).toHaveBeenCalledWith(mockDto);
    });
  });

  describe('updateArticle', () => {
    it('should update article', async () => {
      mockArticlesService.updateArticle.mockResolvedValue(mockArticle);
      const mockDto: UpdateArticleDto = {
        title: 'Title',
        content: 'Text',
        tagsIds: ['68f48b22-8104-4b47-b846-3db152d8b0ee'],
      };
      const id = '53ef5af1-581a-4e3f-abfb-a7e31c4d1890';
      const result = await controller.updateArticle(id, mockDto);

      expect(result).toEqual(mockArticle);
      expect(mockArticlesService.updateArticle).toHaveBeenCalledWith(
        id,
        mockDto,
      );
    });
  });

  describe('removeArticle', () => {
    it('should remove article', async () => {
      mockArticlesService.removeArticle.mockResolvedValue(void 0);
      const id = '53ef5af1-581a-4e3f-abfb-a7e31c4d1890';
      const result = await controller.removeArticle(id);

      expect(result).toBeUndefined();
      expect(mockArticlesService.removeArticle).toHaveBeenCalledWith(id);
    });
  });

  describe('getArticleById', () => {
    it('should get article by id', async () => {
      mockArticlesService.getArticleById.mockResolvedValue(mockArticle);
      const id = '53ef5af1-581a-4e3f-abfb-a7e31c4d1890';
      const result = await controller.getArticleById(id);

      expect(result).toEqual(mockArticle);
      expect(mockArticlesService.getArticleById).toHaveBeenCalledWith(id);
    });
  });

  describe('getAllArticles', () => {
    it('should get list of articles when tagsQuery is empty', async () => {
      const expectedResult: ArticlesListDto = {
        total: 22,
        articles: [mockArticle, mockArticle2],
      };
      mockArticlesService.getAllArticlesWithParams.mockResolvedValue(
        expectedResult,
      );
      const result = await controller.getAllArticles(3, 10, 'text', '');

      expect(result).toEqual(expectedResult);
      expect(mockArticlesService.getAllArticlesWithParams).toHaveBeenCalledWith(
        3,
        10,
        'text',
        [],
      );
    });

    it('should get list of articles when tagsQuery is not empty', async () => {
      const expectedResult: ArticlesListDto = {
        total: 31,
        articles: [mockArticle2],
      };
      mockArticlesService.getAllArticlesWithParams.mockResolvedValue(
        expectedResult,
      );
      const tagId = '68f48b22-8104-4b47-b846-3db152d8b0ee';
      const result = await controller.getAllArticles(3, 10, 'text', tagId);

      expect(result).toEqual(expectedResult);
      expect(mockArticlesService.getAllArticlesWithParams).toHaveBeenCalledWith(
        3,
        10,
        'text',
        [tagId],
      );
    });
  });
});
