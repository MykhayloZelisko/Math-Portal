import { Test, TestingModule } from '@nestjs/testing';
import { ArticlesService } from './articles.service';
import { TagsService } from '../tags/tags.service';
import { CommentsService } from '../comments/comments.service';
import { getModelToken } from '@nestjs/sequelize';
import { Article } from './models/article.model';
import { CreateArticleDto } from './dto/create-article.dto';
import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Tag } from '../tags/models/tag.model';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Comment } from '../comments/models/comment.model';
import { User } from '../users/models/user.model';
import { ArticlesListDto } from './dto/articles-list.dto';
import { Sequelize } from 'sequelize';

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
  const mockTag: Tag = {
    id: '68f48b22-8104-4b47-b846-3db152d8b0ee',
    value: 'Tag',
  } as Tag;
  const mockArticle: Article = {
    id: '53ef5af1-581a-4e3f-abfb-a7e31c4d1890',
    title: 'Title',
    content: 'Text',
    rating: 0,
    votes: 0,
    tags: [mockTag],
    $set: () => {},
    save: () => {},
  } as unknown as Article;
  const mockArticle2: Article = {
    id: '53ef5af1-581a-4e3f-abfb-a7e31c4d1891',
    title: 'Title',
    content: 'Text',
    rating: 0,
    votes: 0,
    tags: [mockTag],
    $set: () => {},
    save: () => {},
  } as unknown as Article;
  const mockArticles: Article[] = [mockArticle, mockArticle2];
  const mockUser: User = {
    email: 'email@mail.com',
    firstName: 'John',
    id: '6869d59c-1858-46a2-b8ff-273f29e4566e',
    isAdmin: true,
    lastName: 'Doe',
    photo: 'photo',
    password: 'Pa$$word094',
  } as User;
  const mockComment: Comment = {
    id: 'c0894f95-cc73-4c8d-9fcd-593445733858',
    content: 'comment',
    createdAt: '',
    updatedAt: '',
    likesUsersIds: [mockUser.id],
    dislikesUsersIds: [mockUser.id],
    userId: mockUser.id,
    user: mockUser,
  } as Comment;
  const mockComment2: Comment = {
    id: 'd7975de2-9a28-4359-ba68-523d8e9dcf18',
    content: 'comment',
    createdAt: '',
    updatedAt: '',
    likesUsersIds: [mockUser.id],
    dislikesUsersIds: [mockUser.id],
    userId: mockUser.id,
    user: mockUser,
  } as Comment;
  const mockResult: ArticlesListDto = {
    total: 12,
    articles: mockArticles,
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

  describe('createArticle', () => {
    it('should throw bad request exception', async () => {
      const mockData: CreateArticleDto = {
        content: 'Content',
        tagsIds: ['68f48b22-8104-4b47-b846-3db152d8b0ee'],
        title: 'Title',
      };
      mockTagsService.getAllTags.mockResolvedValue([mockTag]);
      mockArticleRepository.create.mockRejectedValue(new Error());
      const result = service.createArticle(mockData);

      await expect(result).rejects.toThrow(
        new BadRequestException('Article is not created'),
      );
    });

    it('should throw bad request exception when tags array is empty', async () => {
      const mockData: CreateArticleDto = {
        content: 'Content',
        tagsIds: ['68f48b22-8104-4b47-b846-3db152d8b0ee'],
        title: 'Title',
      };
      mockTagsService.getAllTags.mockResolvedValue([]);
      const result = service.createArticle(mockData);

      await expect(result).rejects.toThrow(
        new BadRequestException('Article is not created'),
      );
    });

    it('should return new article', async () => {
      const mockData: CreateArticleDto = {
        content: 'Content',
        tagsIds: ['68f48b22-8104-4b47-b846-3db152d8b0ee'],
        title: 'Title',
      };
      mockTagsService.getAllTags.mockResolvedValue([mockTag]);
      mockArticleRepository.create.mockResolvedValue(mockArticle);
      jest.spyOn(mockArticle, '$set').mockResolvedValue(mockArticle);
      jest.spyOn(service, 'getArticleById').mockResolvedValue(mockArticle);
      const result = await service.createArticle(mockData);

      expect(result).toEqual(mockArticle);
    });
  });

  describe('updateArticle', () => {
    it('should throw bad request exception', async () => {
      const mockData: UpdateArticleDto = {
        content: 'Content',
        tagsIds: ['68f48b22-8104-4b47-b846-3db152d8b0ee'],
        title: 'Title',
      };
      jest.spyOn(service, 'getArticleById').mockResolvedValue(mockArticle);
      mockTagsService.getAllTags.mockResolvedValue([mockTag]);
      jest.spyOn(mockArticle, 'save').mockRejectedValue(new Error());
      const result = service.updateArticle(mockArticle.id, mockData);

      await expect(result).rejects.toThrow(
        new BadRequestException('Article is not updated'),
      );
    });

    it('should throw bad request exception when tags array is empty', async () => {
      const mockData: UpdateArticleDto = {
        content: 'Content',
        tagsIds: ['68f48b22-8104-4b47-b846-3db152d8b0ee'],
        title: 'Title',
      };
      jest.spyOn(service, 'getArticleById').mockResolvedValue(mockArticle);
      mockTagsService.getAllTags.mockResolvedValue([]);
      const result = service.updateArticle(mockArticle.id, mockData);

      await expect(result).rejects.toThrow(
        new BadRequestException('Article is not updated'),
      );
    });

    it('should return updated article', async () => {
      const mockData: CreateArticleDto = {
        content: 'Content',
        tagsIds: ['68f48b22-8104-4b47-b846-3db152d8b0ee'],
        title: 'Title',
      };
      jest.spyOn(service, 'getArticleById').mockResolvedValue(mockArticle);
      mockTagsService.getAllTags.mockResolvedValue([mockTag]);
      mockArticleRepository.create.mockResolvedValue(mockArticle);
      jest.spyOn(mockArticle, 'save').mockResolvedValue(mockArticle);
      jest.spyOn(mockArticle, '$set').mockResolvedValue(mockArticle);
      jest.spyOn(service, 'getArticleById').mockResolvedValue(mockArticle);
      const result = await service.updateArticle(mockArticle.id, mockData);

      expect(result).toEqual(mockArticle);
    });
  });

  describe('removeArticle', () => {
    it('should remove article', async () => {
      jest.spyOn(service, 'getArticleById').mockResolvedValue(mockArticle);
      mockCommentsService.getAllCommentsByArticleId.mockResolvedValue([
        mockComment,
        mockComment2,
      ]);
      await service.removeArticle(mockArticle.id);

      expect(mockArticleRepository.destroy).toHaveBeenCalledWith({
        where: { id: mockArticle.id },
      });
      expect(mockCommentsService.removeCommentsArray).toHaveBeenCalledWith([
        mockComment.id,
        mockComment2.id,
      ]);
    });
  });

  describe('getArticleById', () => {
    it('should throw notfound exception', async () => {
      mockArticleRepository.findByPk.mockResolvedValue(null);
      const result = service.getArticleById(mockArticle.id);

      await expect(result).rejects.toThrow(
        new NotFoundException('Article not found'),
      );
    });

    it('should return article by id', async () => {
      mockArticleRepository.findByPk.mockResolvedValue(mockArticle);
      const result = await service.getArticleById(mockArticle.id);

      expect(result).toEqual(mockArticle);
    });
  });

  describe('getAllArticles', () => {
    it('should return all articles', async () => {
      mockArticleRepository.findAll.mockResolvedValue(mockArticles);
      const result = await service.getAllArticles();

      expect(result).toEqual(mockArticles);
    });
  });

  describe('getAllArticlesWithParams', () => {
    it('should throw internal server error', async () => {
      jest.spyOn(service, 'getAllArticles').mockRejectedValue(new Error());
      const result = service.getAllArticlesWithParams(1, 10, '', []);

      await expect(result).rejects.toThrow(
        new InternalServerErrorException('Internal server error'),
      );
    });

    it('should return part of articles without filters', async () => {
      jest.spyOn(service, 'getAllArticles').mockResolvedValue(mockArticles);
      mockArticleRepository.count.mockResolvedValue(12);
      const result = await service.getAllArticlesWithParams(1, 10, '', []);

      expect(result).toEqual(mockResult);
    });

    it('should return part of articles with text and tags', async () => {
      // @ts-expect-error: query error
      jest
        .spyOn(Sequelize.prototype, 'query')
        .mockResolvedValueOnce(mockArticles);
      // @ts-expect-error: query error
      jest
        .spyOn(Sequelize.prototype, 'query')
        .mockResolvedValueOnce([{ total: 12 }]);
      const result = await service.getAllArticlesWithParams(1, 10, 'text', [
        mockTag.id,
      ]);

      expect(result).toEqual(mockResult);
    });

    it('should return empty list with text and tags', async () => {
      // @ts-expect-error: query error
      jest.spyOn(Sequelize.prototype, 'query').mockResolvedValueOnce([]);
      // @ts-expect-error: query error
      jest.spyOn(Sequelize.prototype, 'query').mockResolvedValueOnce([]);
      const result = await service.getAllArticlesWithParams(1, 10, 'text', [
        mockTag.id,
      ]);

      expect(result).toEqual({ total: 0, articles: [] });
    });

    it('should return part of articles with text but without tags', async () => {
      jest.spyOn(service, 'getAllArticles').mockResolvedValue(mockArticles);
      mockArticleRepository.count.mockResolvedValue(12);
      const result = await service.getAllArticlesWithParams(1, 10, 'text', []);

      expect(result).toEqual(mockResult);
    });

    it('should return part of articles without text but with tags', async () => {
      // @ts-expect-error: query error
      jest
        .spyOn(Sequelize.prototype, 'query')
        .mockResolvedValueOnce(mockArticles);
      // @ts-expect-error: query error
      jest
        .spyOn(Sequelize.prototype, 'query')
        .mockResolvedValueOnce([{ total: 12 }]);
      const result = await service.getAllArticlesWithParams(1, 10, ' ', [
        mockTag.id,
      ]);

      expect(result).toEqual(mockResult);
    });

    it('should return empty list without text but with tags', async () => {
      // @ts-expect-error: query error
      jest.spyOn(Sequelize.prototype, 'query').mockResolvedValueOnce([]);
      // @ts-expect-error: query error
      jest.spyOn(Sequelize.prototype, 'query').mockResolvedValueOnce([]);
      const result = await service.getAllArticlesWithParams(1, 10, ' ', [
        mockTag.id,
      ]);

      expect(result).toEqual({ total: 0, articles: [] });
    });
  });
});
