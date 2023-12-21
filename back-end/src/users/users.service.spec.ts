import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getModelToken } from '@nestjs/sequelize';
import { User } from './models/user.model';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { FilesService } from '../files/files.service';
import { RatingService } from '../rating/rating.service';
import { CommentsService } from '../comments/comments.service';

describe('UsersService', () => {
  let service: UsersService;
  const mockUserRepository = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    findByPk: jest.fn(),
    destroy: jest.fn(),
    count: jest.fn(),
  };
  const mockAuthService = {
    generateToken: jest.fn(),
  };
  const mockJwtService = {
    verifyAsync: jest.fn(),
  };
  const mockFilesService = {
    removeImageFile: jest.fn(),
    createImageFile: jest.fn(),
  };
  const mockRatingService = {
    recalculateArticlesRating: jest.fn(),
  };
  const mockCommentsService = {
    getAllCommentsByUserId: jest.fn(),
    getDescendantsIds: jest.fn(),
    removeCommentsArray: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getModelToken(User), useValue: mockUserRepository },
        { provide: AuthService, useValue: mockAuthService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: FilesService, useValue: mockFilesService },
        { provide: RatingService, useValue: mockRatingService },
        { provide: CommentsService, useValue: mockCommentsService },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
