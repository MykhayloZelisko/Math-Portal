import { Test, TestingModule } from '@nestjs/testing';
import { RatingService } from './rating.service';
import { UsersService } from '../users/users.service';
import { ArticlesService } from '../articles/articles.service';
import { JwtService } from '@nestjs/jwt';
import { Rating } from './models/rating.model';
import { getModelToken } from '@nestjs/sequelize';
import { User } from '../users/models/user.model';
import { Article } from '../articles/models/article.model';
import { Tag } from '../tags/models/tag.model';
import { CreateRatingDto } from './dto/create-rating.dto';
import { BadRequestException, ConflictException } from '@nestjs/common';
import { ArticleRatingDto } from './dto/article-rating.dto';

describe('RatingService', () => {
  let service: RatingService;
  const mockUsersService = {
    getUserById: jest.fn(),
  };
  const mockArticlesService = {
    getArticleById: jest.fn(),
  };
  const mockJwtService = {
    verifyAsync: jest.fn(),
  };
  const mockRatingRepository = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    count: jest.fn(),
    sum: jest.fn(),
  };
  const mockUser: User = {
    email: 'email@mail.com',
    firstName: 'John',
    id: '6869d59c-1858-46a2-b8ff-273f29e4566e',
    isAdmin: false,
    lastName: 'Doe',
    photo: null,
    password: 'Pa$$word094',
  } as User;
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
    save: () => {},
  } as Article;
  const mockArticle2: Article = {
    id: '53ef5af1-581a-4e3f-abfb-a7e31c4d1891',
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
    save: () => {},
  } as Article;
  const mockRateData: CreateRatingDto = {
    articleId: '53ef5af1-581a-4e3f-abfb-a7e31c4d1890',
    rate: 4,
  };
  const mockRating: Rating = {
    id: '51335760-ead7-4784-92a1-c3e80cb38eba',
    articleId: '53ef5af1-581a-4e3f-abfb-a7e31c4d1890',
    article: mockArticle,
    userId: '6869d59c-1858-46a2-b8ff-273f29e4566e',
    user: mockUser,
    rate: 5,
    $set: () => {},
  } as unknown as Rating;
  const mockRating2: Rating = {
    id: '51335760-ead7-4784-92a1-c3e80cb38eba',
    articleId: '53ef5af1-581a-4e3f-abfb-a7e31c4d1891',
    article: mockArticle,
    userId: '6869d59c-1858-46a2-b8ff-273f29e4566e',
    user: mockUser,
    rate: 5,
    $set: () => {},
  } as unknown as Rating;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RatingService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: ArticlesService, useValue: mockArticlesService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: getModelToken(Rating), useValue: mockRatingRepository },
      ],
    }).compile();

    service = module.get<RatingService>(RatingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('updateArticleRating', () => {
    it('should throw bad request exception', async () => {
      mockJwtService.verifyAsync.mockResolvedValue({ id: mockUser.id });
      mockUsersService.getUserById.mockResolvedValue(mockUser);
      mockArticlesService.getArticleById.mockResolvedValue(null);
      const result = service.updateArticleRating(mockRateData, 'token');

      await expect(result).rejects.toThrow(
        new BadRequestException('Rating is not updated'),
      );
    });

    it('should throw conflict exception', async () => {
      mockJwtService.verifyAsync.mockResolvedValue({ id: mockUser.id });
      mockUsersService.getUserById.mockResolvedValue(mockUser);
      mockArticlesService.getArticleById.mockResolvedValue(mockArticle);
      jest
        .spyOn(service, 'getCurrentArticleStatus')
        .mockResolvedValue({ canBeRated: false });
      const result = service.updateArticleRating(mockRateData, 'token');

      await expect(result).rejects.toThrow(
        new ConflictException('Rating cannot be updated'),
      );
    });

    it('should update rating', async () => {
      mockJwtService.verifyAsync.mockResolvedValue({ id: mockUser.id });
      mockUsersService.getUserById.mockResolvedValue(mockUser);
      mockArticlesService.getArticleById.mockResolvedValue(mockArticle);
      jest
        .spyOn(service, 'getCurrentArticleStatus')
        .mockResolvedValue({ canBeRated: true });
      mockRatingRepository.create.mockResolvedValue(mockRating);
      mockRatingRepository.sum.mockResolvedValue(111);
      mockRatingRepository.count.mockResolvedValue(30);
      const mockResult: ArticleRatingDto = {
        rating: 3.7,
        votes: 30,
      };
      const result = await service.updateArticleRating(mockRateData, 'token');

      expect(result).toEqual(mockResult);
    });
  });

  describe('getCurrentArticleStatus', () => {
    it('should return object with false when user or article are not found', async () => {
      mockJwtService.verifyAsync.mockResolvedValue({ id: mockUser.id });
      mockUsersService.getUserById.mockResolvedValue(mockUser);
      mockArticlesService.getArticleById.mockResolvedValue(null);
      const result = await service.getCurrentArticleStatus(
        mockArticle.id,
        'token',
      );

      expect(result).toEqual({ canBeRated: false });
    });

    it('should return object with true', async () => {
      mockJwtService.verifyAsync.mockResolvedValue({ id: mockUser.id });
      mockUsersService.getUserById.mockResolvedValue(mockUser);
      mockArticlesService.getArticleById.mockResolvedValue(mockArticle);
      mockRatingRepository.findOne.mockResolvedValue(null);
      const result = await service.getCurrentArticleStatus(
        mockArticle.id,
        'token',
      );

      expect(result).toEqual({ canBeRated: true });
    });

    it('should return object with false when error is thrown', async () => {
      mockJwtService.verifyAsync.mockResolvedValue({ id: mockUser.id });
      mockUsersService.getUserById.mockResolvedValue(mockUser);
      mockArticlesService.getArticleById.mockResolvedValue(mockArticle);
      mockRatingRepository.findOne.mockRejectedValue(new Error());
      const result = await service.getCurrentArticleStatus(
        mockArticle.id,
        'token',
      );

      expect(result).toEqual({ canBeRated: false });
    });
  });

  describe('recalculateArticlesRating', () => {
    it('should update article rating', async () => {
      const mockRatings: Rating[] = [mockRating, mockRating2];
      const mockArticles: Article[] = [mockArticle, mockArticle2];
      const mockSums: number[] = [100, 200];
      const mockVotes: number[] = [26, 45];
      const mockNewRatings: number[] = [3.85, 4.44];
      mockRatingRepository.findAll.mockResolvedValue(mockRatings);
      for (let i = 0; i < mockArticles.length; i++) {
        mockArticlesService.getArticleById.mockResolvedValue(mockArticles[i]);
        mockRatingRepository.sum.mockResolvedValue(mockSums[i]);
        mockRatingRepository.count.mockResolvedValue(mockVotes[i]);
        await service.recalculateArticlesRating(mockUser.id);

        expect(mockArticles[i].rating).toBe(mockNewRatings[i]);
        expect(mockArticles[i].votes).toBe(mockVotes[i]);
      }
    });
  });
});
