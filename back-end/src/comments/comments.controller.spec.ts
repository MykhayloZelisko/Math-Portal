import { Test, TestingModule } from '@nestjs/testing';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { AdminGuard } from '../auth/guards/admin/admin.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Comment } from './models/comment.model';
import { User } from '../users/models/user.model';
import { UpdateLikeDislikeDto } from './dto/update-like-dislike.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

describe('CommentsController', () => {
  let controller: CommentsController;
  const mockCommentsService = {
    createComment: jest.fn(),
    getAllCommentsByArticleId: jest.fn(),
    removeComment: jest.fn(),
    addLikeDislike: jest.fn(),
    updateComment: jest.fn(),
  };
  const mockAdminGuard = {
    canActivate: jest.fn(),
  };
  const mockJwtAuthGuard = {
    canActivate: jest.fn(),
  };
  const mockRequest: Request = {
    headers: {
      authorization: 'Bearer token',
    } as unknown as Headers,
  } as Request;
  const mockUser: User = {
    email: 'email@mail.com',
    firstName: 'John',
    id: '125da473-7276-431c-b199-2f0dafa912c4',
    isAdmin: true,
    lastName: 'Doe',
    photo: null,
  } as User;
  const mockComment: Comment = {
    content: 'new comment',
    dislikesUsersIds: ['b49f1307-13ff-49f7-9540-11f04d61baca'],
    id: '3af51ac7-7b6b-465e-8a1b-d6a28d3e6296',
    likesUsersIds: ['58df415d-4965-4aab-9593-62b0baeb8da7'],
    user: mockUser,
    userId: '125da473-7276-431c-b199-2f0dafa912c4',
  } as Comment;
  const mockComment2: Comment = {
    content: 'comment 2',
    dislikesUsersIds: ['4523beac-701f-4d2a-9f36-382e56f77272'],
    id: '39d9b8a9-41bd-4d98-9158-2e18ea371429',
    likesUsersIds: ['1d508305-f824-4429-9df1-c0a89a10f36b'],
    user: mockUser,
    userId: '125da473-7276-431c-b199-2f0dafa912c4',
  } as Comment;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentsController],
      providers: [{ provide: CommentsService, useValue: mockCommentsService }],
    })
      .overrideGuard(AdminGuard)
      .useValue(mockAdminGuard)
      .overrideGuard(JwtAuthGuard)
      .useValue(mockJwtAuthGuard)
      .compile();

    controller = module.get<CommentsController>(CommentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createComment', () => {
    it('should create comment', async () => {
      const mockCreateDto: CreateCommentDto = {
        articleId: '6869d59c-1858-46a2-b8ff-273f29e4566e',
        content: 'new comment',
        level: 1,
        parentCommentId: null,
      };
      mockCommentsService.createComment.mockResolvedValue(mockComment);
      const result = await controller.createComment(mockRequest, mockCreateDto);

      expect(result).toEqual(mockComment);
      expect(mockCommentsService.createComment).toHaveBeenCalledWith(mockCreateDto, 'token');
    });
  });

  describe('getAllComments', () => {
    it('should get list of comments for current article', async () => {
      const expectedResult: Comment[] = [mockComment, mockComment2];
      mockCommentsService.getAllCommentsByArticleId.mockResolvedValue(
        expectedResult,
      );
      const articleId = '1d508305-f824-4429-9df1-c0a89a10f36b';
      const result = await controller.getAllComments(articleId);

      expect(result).toEqual(expectedResult);
      expect(mockCommentsService.getAllCommentsByArticleId).toHaveBeenCalledWith(articleId);
    });
  });

  describe('removeComment', () => {
    it('should remove comment', async () => {
      const commentId = '39d9b8a9-41bd-4d98-9158-2e18ea371429';
      mockCommentsService.removeComment.mockResolvedValue(void 0);
      const result = await controller.removeComment(commentId);

      expect(result).toBeUndefined();
      expect(mockCommentsService.removeComment).toHaveBeenCalledWith(commentId);
    });
  });

  describe('updateLikesStatus', () => {
    it('should update likes or dislikes', async () => {
      const mockLikes: UpdateLikeDislikeDto = {
        commentId: '3af51ac7-7b6b-465e-8a1b-d6a28d3e6296',
        status: 1,
      };
      mockCommentsService.addLikeDislike.mockResolvedValue(mockComment);
      const result = await controller.updateLikesStatus(mockRequest, mockLikes);

      expect(result).toEqual(mockComment);
      expect(mockCommentsService.addLikeDislike).toHaveBeenCalledWith(mockLikes, 'token');
    });
  });

  describe('updateComment', () => {
    it('should update comment', async () => {
      const mockUpdateDto: UpdateCommentDto = {
        content: 'new comment',
      };
      const commentId = '3af51ac7-7b6b-465e-8a1b-d6a28d3e6296';
      mockCommentsService.updateComment.mockResolvedValue(mockComment);
      const result = await controller.updateComment(
        mockRequest,
        commentId,
        mockUpdateDto,
      );

      expect(result).toEqual(mockComment);
      expect(mockCommentsService.updateComment).toHaveBeenCalledWith(commentId, mockUpdateDto, 'token');
    });
  });
});
