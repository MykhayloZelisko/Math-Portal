import { Test, TestingModule } from '@nestjs/testing';
import { CommentsService } from './comments.service';
import { getModelToken } from '@nestjs/sequelize';
import { Comment } from './models/comment.model';
import { CommentsTree } from './models/comments-tree.model';
import { UsersService } from '../users/users.service';
import { ArticlesService } from '../articles/articles.service';
import { JwtService } from '@nestjs/jwt';

describe('CommentsService', () => {
  let service: CommentsService;
  const mockCommentRepository = {
    findAll: jest.fn(),
    create: jest.fn(),
    findByPk: jest.fn(),
    destroy: jest.fn(),
  };
  const mockTreeRepository = {
    findAll: jest.fn(),
    create: jest.fn(),
  };
  const mockUsersService = {
    getUserById: jest.fn(),
  };
  const mockArticlesService = {
    getArticleById: jest.fn(),
  };
  const mockJwtService = {
    verifyAsync: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentsService,
        { provide: getModelToken(Comment), useValue: mockCommentRepository },
        { provide: getModelToken(CommentsTree), useValue: mockTreeRepository },
        { provide: UsersService, useValue: mockUsersService },
        { provide: ArticlesService, useValue: mockArticlesService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<CommentsService>(CommentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
