import { Test, TestingModule } from '@nestjs/testing';
import { RatingController } from './rating.controller';
import { RatingService } from './rating.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { AuthWithoutExceptionsGuard } from '../auth/guards/auth-without-exceptions/auth-without-exceptions.guard';
import { CreateRatingDto } from './dto/create-rating.dto';
import { ArticleRatingDto } from './dto/article-rating.dto';
import { CurrentArticleStatusDto } from './dto/current-article-status.dto';

describe('RatingController', () => {
  let controller: RatingController;
  const mockRatingService = {
    updateArticleRating: jest.fn(),
    getCurrentArticleStatus: jest.fn(),
  };
  const mockJwtAuthGuard = {
    canActivate: jest.fn(),
  };
  const mockAuthWithoutExceptionsGuard = {
    canActivate: jest.fn(),
  };
  const mockRequest: Request = {
    headers: {
      authorization: 'Bearer token',
    } as unknown as Headers,
  } as Request;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RatingController],
      providers: [{ provide: RatingService, useValue: mockRatingService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(mockJwtAuthGuard)
      .overrideGuard(AuthWithoutExceptionsGuard)
      .useValue(mockAuthWithoutExceptionsGuard)
      .compile();

    controller = module.get<RatingController>(RatingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('updateArticleRating', () => {
    it('should update rating', async () => {
      const mockRating: CreateRatingDto = {
        articleId: '6869d59c-1858-46a2-b8ff-273f29e4566e',
        rate: 4,
      };
      const expectedResult: ArticleRatingDto = {
        rating: 4.7,
        votes: 10,
      };
      mockRatingService.updateArticleRating.mockResolvedValue(expectedResult);
      const result = await controller.updateArticleRating(
        mockRequest,
        mockRating,
      );

      expect(result).toEqual(expectedResult);
      expect(mockRatingService.updateArticleRating).toHaveBeenCalledWith(mockRating, 'token');
    });
  });

  describe('getCurrentArticleStatus', () => {
    it('should be able to rate', async () => {
      const articleId = '6869d59c-1858-46a2-b8ff-273f29e4566e';
      const expectedResult: CurrentArticleStatusDto = { canBeRated: true };
      mockRatingService.getCurrentArticleStatus.mockResolvedValue(expectedResult);
      const result = await controller.getCurrentArticleStatus(
        mockRequest,
        articleId,
      );

      expect(result).toEqual(expectedResult);
      expect(mockRatingService.getCurrentArticleStatus).toHaveBeenCalledWith(articleId, 'token');
    });

    it('should not be able to rate', async () => {
      const articleId = '6869d59c-1858-46a2-b8ff-273f29e4566e';
      const expectedResult: CurrentArticleStatusDto = { canBeRated: false };
      const mockRequest2: Request = {
        headers: {} as unknown as Headers,
      } as Request;
      mockRatingService.getCurrentArticleStatus.mockResolvedValue(expectedResult);
      const result = await controller.getCurrentArticleStatus(
        mockRequest2,
        articleId,
      );

      expect(result).toEqual(expectedResult);
      expect(mockRatingService.getCurrentArticleStatus).toHaveBeenCalledWith(articleId, '');
    });
  });
});
