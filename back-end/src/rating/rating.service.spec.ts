import { Test, TestingModule } from '@nestjs/testing';
import { RatingService } from './rating.service';
import { UsersService } from '../users/users.service';
import { ArticlesService } from '../articles/articles.service';
import { JwtService } from '@nestjs/jwt';
import { Rating } from './models/rating.model';
import { getModelToken } from '@nestjs/sequelize';

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
});
