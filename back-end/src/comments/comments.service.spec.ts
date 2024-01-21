import { Test, TestingModule } from '@nestjs/testing';
import { CommentsService } from './comments.service';
import { getModelToken } from '@nestjs/sequelize';
import { Comment } from './models/comment.model';
import { CommentsTree } from './models/comments-tree.model';
import { UsersService } from '../users/users.service';
import { ArticlesService } from '../articles/articles.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/models/user.model';
import { Tag } from '../tags/models/tag.model';
import { Article } from '../articles/models/article.model';
import { CreateCommentDto } from './dto/create-comment.dto';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { UpdateLikeDislikeDto } from './dto/update-like-dislike.dto';

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
  const mockUser: User = {
    email: 'email@mail.com',
    firstName: 'John',
    id: '6869d59c-1858-46a2-b8ff-273f29e4566e',
    isAdmin: true,
    lastName: 'Doe',
    photo: 'photo',
    password: 'Pa$$word094',
    save: () => {},
  } as User;
  const mockUser2: User = {
    email: 'email2@mail.com',
    firstName: 'Jane',
    id: '885d3feb-3ae9-4dce-85aa-0751a415ad7b',
    isAdmin: false,
    lastName: 'Doe',
    photo: null,
    password: 'Pa$$word094',
  } as User;
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
  } as Article;
  const mockComment: Comment = {
    id: 'c0894f95-cc73-4c8d-9fcd-593445733858',
    content: 'comment',
    createdAt: '',
    updatedAt: '',
    likesUsersIds: [mockUser.id],
    dislikesUsersIds: [mockUser2.id],
    userId: mockUser.id,
    user: mockUser,
    save: () => {},
  } as Comment;
  const mockComment2: Comment = {
    id: 'd7975de2-9a28-4359-ba68-523d8e9dcf18',
    content: 'comment',
    createdAt: '',
    updatedAt: '',
    likesUsersIds: [mockUser2.id],
    dislikesUsersIds: [mockUser.id],
    userId: mockUser2.id,
    user: mockUser2,
    save: () => {},
  } as Comment;
  const mockComments: Comment[] = [mockComment, mockComment2];
  const mockIds: string[] = [mockComment.id, mockComment2.id];
  const mockTree: CommentsTree[] = [
    {
      id: 'a5daf536-67c5-4319-929e-b8df74d863bd',
      ancestorId: mockComment.id,
      nearestAncestorId: mockComment.id,
      descendantId: mockComment2.id,
      level: 2,
      articleId: mockArticle.id,
      ancestor: mockComment,
      descendant: mockComment2,
    } as CommentsTree,
    {
      id: '70103d8e-5076-47c4-8af1-e2c783dd9c5a',
      ancestorId: mockComment2.id,
      nearestAncestorId: mockComment.id,
      descendantId: mockComment2.id,
      level: 2,
      articleId: mockArticle.id,
      ancestor: mockComment2,
      descendant: mockComment2,
    } as CommentsTree,
  ];

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

  describe('createComment', () => {
    it('should return new comment', async () => {
      mockJwtService.verifyAsync.mockResolvedValue({ id: mockUser.id });
      mockUsersService.getUserById.mockResolvedValue(mockUser);
      mockArticlesService.getArticleById.mockResolvedValue(mockArticle);
      mockCommentRepository.create.mockResolvedValue(mockComment2);
      mockCommentRepository.findAll.mockResolvedValue([mockComment]);
      for (let i = 0; i < mockComments.length; i++) {
        mockTreeRepository.create.mockResolvedValue(mockTree[i]);
      }
      jest.spyOn(service, 'getCommentById').mockResolvedValue(mockComment2);
      const mockData: CreateCommentDto = {
        articleId: mockArticle.id,
        content: 'Comment',
        level: 2,
        parentCommentId: mockComment.id,
      };
      const result = await service.createComment(mockData, 'token');

      for (const item of mockComments) {
        expect(mockTreeRepository.create).toHaveBeenCalledWith({
          ancestorId: item.id,
          nearestAncestorId: mockComment.id,
          descendantId: mockComment2.id,
          level: 2,
          articleId: mockArticle.id,
        });
      }
      expect(result).toEqual(mockComment2);
    });
  });

  describe('updateComment', () => {
    it('should throw forbidden exception', async () => {
      mockJwtService.verifyAsync.mockResolvedValue({ id: mockUser2.id });
      mockUsersService.getUserById.mockResolvedValue(mockUser2);
      jest.spyOn(service, 'getCommentById').mockResolvedValue(mockComment);
      const result = service.updateComment(
        mockComment.id,
        { content: 'Comment' },
        'token',
      );

      await expect(result).rejects.toThrow(
        new ForbiddenException('The user is not the author of the comment'),
      );
    });

    it('should return updated comment', async () => {
      mockJwtService.verifyAsync.mockResolvedValue({ id: mockUser.id });
      mockUsersService.getUserById.mockResolvedValue(mockUser);
      jest.spyOn(service, 'getCommentById').mockResolvedValueOnce(mockComment);
      jest.spyOn(mockComment, 'save').mockResolvedValue(mockComment);
      jest.spyOn(service, 'getCommentById').mockResolvedValueOnce(mockComment);
      const result = await service.updateComment(
        mockComment.id,
        { content: 'Comment' },
        'token',
      );

      expect(result).toEqual(mockComment);
    });
  });

  describe('getCommentById', () => {
    it('should throw notfound exception', async () => {
      mockCommentRepository.findByPk.mockResolvedValue(null);
      const result = service.getCommentById(mockComment.id);

      await expect(result).rejects.toThrow(
        new NotFoundException('Comment not found'),
      );
    });

    it('should return comment', async () => {
      mockCommentRepository.findByPk.mockResolvedValue(mockComment);
      const result = await service.getCommentById(mockComment.id);

      expect(result).toEqual(mockComment);
    });
  });

  describe('removeComment', () => {
    it('should delete comment', async () => {
      jest.spyOn(service, 'getCommentById').mockResolvedValue(mockComment);
      jest.spyOn(service, 'getDescendantsIds').mockResolvedValue(mockIds);
      jest.spyOn(service, 'removeCommentsArray');
      await service.removeComment(mockComment.id);

      expect(service.removeCommentsArray).toHaveBeenCalledWith(mockIds);
    });
  });

  describe('removeCommentsArray', () => {
    it('should delete comments array', async () => {
      await service.removeCommentsArray(mockIds);

      expect(mockCommentRepository.destroy).toHaveBeenCalledWith({
        where: { id: mockIds },
      });
    });
  });

  describe('addLikeDislike', () => {
    it('should delete dislike', async () => {
      const mockResult = {
        ...mockComment2,
        dislikesUsersIds: [],
      } as unknown as Comment;
      mockJwtService.verifyAsync.mockResolvedValue({ id: mockUser.id });
      mockUsersService.getUserById.mockResolvedValue(mockUser);
      jest.spyOn(service, 'getCommentById').mockResolvedValueOnce(mockComment2);
      jest.spyOn(mockComment2, 'save').mockResolvedValue(mockResult);
      jest.spyOn(service, 'getCommentById').mockResolvedValueOnce(mockResult);
      const mockDislike: UpdateLikeDislikeDto = {
        commentId: mockComment2.id,
        status: -1,
      };
      const result = await service.addLikeDislike(mockDislike, 'token');

      expect(result).toEqual(mockResult);
    });

    it('should add dislike', async () => {
      const mockResult = {
        ...mockComment,
        dislikesUsersIds: [mockUser2.id, mockUser.id],
      } as Comment;
      mockJwtService.verifyAsync.mockResolvedValue({ id: mockUser.id });
      mockUsersService.getUserById.mockResolvedValue(mockUser);
      jest.spyOn(service, 'getCommentById').mockResolvedValueOnce(mockComment);
      jest.spyOn(mockComment, 'save').mockResolvedValue(mockResult);
      jest.spyOn(service, 'getCommentById').mockResolvedValueOnce(mockResult);
      const mockDislike: UpdateLikeDislikeDto = {
        commentId: mockComment.id,
        status: -1,
      };
      const result = await service.addLikeDislike(mockDislike, 'token');

      expect(result).toEqual(mockResult);
    });

    it('should delete like', async () => {
      const mockResult = {
        ...mockComment2,
        likesUsersIds: [],
      } as unknown as Comment;
      mockJwtService.verifyAsync.mockResolvedValue({ id: mockUser2.id });
      mockUsersService.getUserById.mockResolvedValue(mockUser2);
      jest.spyOn(service, 'getCommentById').mockResolvedValueOnce(mockComment2);
      jest.spyOn(mockComment2, 'save').mockResolvedValue(mockResult);
      jest.spyOn(service, 'getCommentById').mockResolvedValueOnce(mockResult);
      const mockDislike: UpdateLikeDislikeDto = {
        commentId: mockComment2.id,
        status: 1,
      };
      const result = await service.addLikeDislike(mockDislike, 'token');

      expect(result).toEqual(mockResult);
    });

    it('should add like', async () => {
      const mockResult = {
        ...mockComment,
        likesUsersIds: [mockUser.id, mockUser2.id],
      } as unknown as Comment;
      mockJwtService.verifyAsync.mockResolvedValue({ id: mockUser2.id });
      mockUsersService.getUserById.mockResolvedValue(mockUser2);
      jest.spyOn(service, 'getCommentById').mockResolvedValueOnce(mockComment);
      jest.spyOn(mockComment, 'save').mockResolvedValue(mockResult);
      jest.spyOn(service, 'getCommentById').mockResolvedValueOnce(mockResult);
      const mockDislike: UpdateLikeDislikeDto = {
        commentId: mockComment.id,
        status: 1,
      };
      const result = await service.addLikeDislike(mockDislike, 'token');

      expect(result).toEqual(mockResult);
    });
  });

  describe('getAllCommentsByArticleId', () => {
    it('should return comments array', async () => {
      mockCommentRepository.findAll.mockResolvedValue(mockComments);
      const result = await service.getAllCommentsByArticleId(mockArticle.id);

      expect(result).toEqual(mockComments);
    });
  });

  describe('getDescendantsIds', () => {
    it('should return array of descendants', async () => {
      const mockTree2: CommentsTree[] = [
        {
          id: 'a5daf536-67c5-4319-929e-b8df74d863bd',
          ancestorId: mockComment2.id,
          nearestAncestorId: mockComment.id,
          descendantId: mockComment2.id,
          level: 2,
          articleId: mockArticle.id,
          ancestor: mockComment,
          descendant: mockComment2,
        } as CommentsTree,
        {
          id: '70103d8e-5076-47c4-8af1-e2c783dd9c5a',
          ancestorId: mockComment2.id,
          nearestAncestorId: mockComment.id,
          descendantId: mockComment.id,
          level: 2,
          articleId: mockArticle.id,
          ancestor: mockComment2,
          descendant: mockComment2,
        } as CommentsTree,
      ];
      const mockIds2: string[] = [mockComment2.id, mockComment.id];
      mockTreeRepository.findAll.mockResolvedValue(mockTree2);
      const result = await service.getDescendantsIds(mockComment2.id);

      expect(result).toEqual(mockIds2);
    });
  });

  describe('getAllCommentsByUserId', () => {
    it('should return comments list with user id', async () => {
      mockCommentRepository.findAll.mockResolvedValue([mockComment]);
      const result = await service.getAllCommentsByUserId(mockUser.id);

      expect(result).toEqual([mockComment]);
    });
  });
});
