import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getModelToken } from '@nestjs/sequelize';
import { User } from './models/user.model';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { FilesService } from '../files/files.service';
import { RatingService } from '../rating/rating.service';
import { CommentsService } from '../comments/comments.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersListDto } from './dto/users-list.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcryptjs';
import { TokenWithExpDto } from '../auth/dto/token-with-exp.dto';
import { Comment } from '../comments/models/comment.model';

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
  const mockUsersList: User[] = [mockUser, mockUser2];
  const mockToken: TokenWithExpDto = { token: 'token', exp: 60 };

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

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('createUser', () => {
    it('should return user', async () => {
      const mockUserData: CreateUserDto = {
        email: 'email@mail.com',
        firstName: 'John',
        lastName: 'Doe',
        password: 'Pa$$word094',
      };
      mockUserRepository.create.mockResolvedValue(mockUser);
      const result = await service.createUser(mockUserData);

      expect(result).toEqual(mockUser);
    });
  });

  describe('getAllUsers', () => {
    it('should return all users', async () => {
      mockUserRepository.findAll.mockResolvedValue(mockUsersList);
      const result = await service.getAllUsers();

      expect(result).toEqual(mockUsersList);
    });
  });

  describe('getAllUsersWithParams', () => {
    it('should return part of users list with filter value', async () => {
      jest.spyOn(service, 'getAllUsers').mockResolvedValue(mockUsersList);
      mockUserRepository.count.mockResolvedValue(12);
      const mockResult: UsersListDto = {
        total: 12,
        users: mockUsersList,
      };
      const result = await service.getAllUsersWithParams(
        2,
        10,
        'desc',
        'desc',
        'Doe',
      );

      expect(result).toEqual(mockResult);
    });

    it('should return part of users list without filter value', async () => {
      jest.spyOn(service, 'getAllUsers').mockResolvedValue(mockUsersList);
      mockUserRepository.count.mockResolvedValue(22);
      const mockResult: UsersListDto = {
        total: 22,
        users: mockUsersList,
      };
      const result = await service.getAllUsersWithParams(
        3,
        10,
        'desc',
        'desc',
        ' ',
      );

      expect(result).toEqual(mockResult);
    });
  });

  describe('removeUser', () => {
    it('should remove a user with photo', async () => {
      jest.spyOn(service, 'getUserById').mockResolvedValue(mockUser);
      jest
        .spyOn(service, 'removeUserCommentsDescendants')
        .mockResolvedValue(void 0);
      await service.removeUser(mockUser.id);

      expect(mockUserRepository.destroy).toHaveBeenCalledWith({
        where: { id: mockUser.id },
      });
      expect(mockFilesService.removeImageFile).toHaveBeenCalledWith(
        mockUser.photo,
      );
    });

    it('should remove a user without photo', async () => {
      const mockUser3: User = { ...mockUser2 } as User;
      jest.spyOn(service, 'getUserById').mockResolvedValue(mockUser3);
      jest
        .spyOn(service, 'removeUserCommentsDescendants')
        .mockResolvedValue(void 0);
      await service.removeUser(mockUser3.id);

      expect(mockUserRepository.destroy).toHaveBeenCalledWith({
        where: { id: mockUser3.id },
      });
      expect(mockFilesService.removeImageFile).not.toHaveBeenCalled();
    });
  });

  describe('removeCurrentUser', () => {
    it('should remove the current user with photo', async () => {
      mockJwtService.verifyAsync.mockResolvedValue({ id: mockUser.id });
      jest.spyOn(service, 'getUserById').mockResolvedValue(mockUser);
      jest
        .spyOn(service, 'removeUserCommentsDescendants')
        .mockResolvedValue(void 0);
      await service.removeCurrentUser('token');

      expect(mockUserRepository.destroy).toHaveBeenCalledWith({
        where: { id: mockUser.id },
      });
      expect(mockFilesService.removeImageFile).toHaveBeenCalledWith(
        mockUser.photo,
      );
    });

    it('should remove the current user without photo', async () => {
      const mockUser3: User = { ...mockUser2 } as User;
      mockJwtService.verifyAsync.mockResolvedValue({ id: mockUser3.id });
      jest.spyOn(service, 'getUserById').mockResolvedValue(mockUser3);
      jest
        .spyOn(service, 'removeUserCommentsDescendants')
        .mockResolvedValue(void 0);
      await service.removeCurrentUser('token');

      expect(mockUserRepository.destroy).toHaveBeenCalledWith({
        where: { id: mockUser3.id },
      });
      expect(mockFilesService.removeImageFile).not.toHaveBeenCalled();
    });
  });

  describe('getUserByEmail', () => {
    it('should return a user by email', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      const result = await service.getUserByEmail(mockUser.email);

      expect(result).toEqual(mockUser);
    });
  });

  describe('getUserById', () => {
    it('should throw notfound exception', async () => {
      mockUserRepository.findByPk.mockResolvedValue(null);
      const result = service.getUserById(mockUser.id);

      await expect(result).rejects.toThrow(
        new NotFoundException('User not found'),
      );
    });

    it('should throw notfound exception', async () => {
      mockUserRepository.findByPk.mockResolvedValue(mockUser);
      const result = await service.getUserById(mockUser.id);

      expect(result).toEqual(mockUser);
    });
  });

  describe('updateUserRole', () => {
    it('should return another user with new role', async () => {
      const mockData: UpdateUserRoleDto = {
        isAdmin: true,
        userId: mockUser2.id,
      };
      const mockUser3: User = {
        email: 'email2@mail.com',
        firstName: 'Jane',
        id: '885d3feb-3ae9-4dce-85aa-0751a415ad7b',
        isAdmin: true,
        lastName: 'Doe',
        photo: null,
        password: 'Pa$$word094',
      } as User;
      mockJwtService.verifyAsync.mockResolvedValue({ id: mockUser2.id });
      jest.spyOn(service, 'getUserById').mockResolvedValueOnce(mockUser2);
      jest.spyOn(service, 'getUserById').mockResolvedValueOnce(mockUser);
      jest.spyOn(mockUser, 'save').mockResolvedValue(mockUser3);
      const result = await service.updateUserRole(mockData, 'token');

      expect(result).toEqual({
        user: mockUser3,
        token: null,
      });
    });

    it('should return current user with new role', async () => {
      const mockData: UpdateUserRoleDto = {
        isAdmin: true,
        userId: mockUser.id,
      };
      const mockUser3: User = {
        email: 'email@mail.com',
        firstName: 'John',
        id: '6869d59c-1858-46a2-b8ff-273f29e4566e',
        isAdmin: true,
        lastName: 'Doe',
        photo: 'photo',
        password: 'Pa$$word094',
      } as User;
      mockJwtService.verifyAsync.mockResolvedValue({ id: mockUser.id });
      jest.spyOn(service, 'getUserById').mockResolvedValueOnce(mockUser);
      jest.spyOn(service, 'getUserById').mockResolvedValueOnce(mockUser);
      jest.spyOn(mockUser, 'save').mockResolvedValue(mockUser3);
      mockAuthService.generateToken.mockResolvedValue(mockToken);
      const result = await service.updateUserRole(mockData, 'token');

      expect(result).toEqual({
        user: mockUser3,
        token: mockToken,
      });
    });
  });

  describe('gwtCurrentUser', () => {
    it('should return current user', async () => {
      mockJwtService.verifyAsync.mockResolvedValue({ id: mockUser.id });
      jest.spyOn(service, 'getUserById').mockResolvedValue(mockUser);
      const result = await service.getCurrentUser('token');

      expect(result).toEqual(mockUser);
    });
  });

  describe('updateCurrentUser', () => {
    it('should throw bad request exception', async () => {
      const mockData: UpdateUserDto = {
        email: 'email@mail.com',
        firstName: 'John',
        lastName: 'Doe',
        newPassword: null,
        password: 'Pa$$word094',
      };
      mockJwtService.verifyAsync.mockResolvedValue({ id: mockUser.id });
      jest.spyOn(service, 'getUserById').mockResolvedValue(mockUser);
      jest
        .spyOn(bcrypt, 'compare')
        .mockImplementation(() => Promise.resolve(false));
      const result = service.updateCurrentUser(mockData, 'token');

      await expect(result).rejects.toThrow(
        new BadRequestException('Password is incorrect', 'Password Error'),
      );
    });

    it('should return updated user with old password', async () => {
      const mockData: UpdateUserDto = {
        email: 'email@mail.com',
        firstName: 'John',
        lastName: 'Doe',
        newPassword: null,
        password: 'Pa$$word094',
      };
      mockJwtService.verifyAsync.mockResolvedValue({ id: mockUser.id });
      jest.spyOn(service, 'getUserById').mockResolvedValue(mockUser);
      jest
        .spyOn(bcrypt, 'compare')
        .mockImplementation(() => Promise.resolve(true));
      jest.spyOn(mockUser, 'save').mockResolvedValue(mockUser);
      mockAuthService.generateToken.mockResolvedValue(mockToken);
      const result = await service.updateCurrentUser(mockData, 'token');

      expect(result).toEqual({
        user: mockUser,
        token: mockToken,
      });
    });

    it('should return updated user with new password', async () => {
      const mockData: UpdateUserDto = {
        email: 'email@mail.com',
        firstName: 'John',
        lastName: 'Doe',
        newPassword: 'NewPa$$word094',
        password: 'Pa$$word094',
      };
      mockJwtService.verifyAsync.mockResolvedValue({ id: mockUser.id });
      jest.spyOn(service, 'getUserById').mockResolvedValue(mockUser);
      jest
        .spyOn(bcrypt, 'compare')
        .mockImplementation(() => Promise.resolve(true));
      jest
        .spyOn(bcrypt, 'hash')
        .mockImplementation(() => Promise.resolve(mockData.newPassword));
      jest.spyOn(mockUser, 'save').mockResolvedValue(mockUser);
      mockAuthService.generateToken.mockResolvedValue(mockToken);
      const result = await service.updateCurrentUser(mockData, 'token');

      expect(result).toEqual({
        user: mockUser,
        token: mockToken,
      });
    });
  });

  describe('removeCurrentUserPhoto', () => {
    it('should delete photo', async () => {
      const mockUser3: User = {
        email: 'email@mail.com',
        firstName: 'John',
        id: '6869d59c-1858-46a2-b8ff-273f29e4566e',
        isAdmin: true,
        lastName: 'Doe',
        photo: null,
        password: 'Pa$$word094',
      } as User;
      mockJwtService.verifyAsync.mockResolvedValue({ id: mockUser.id });
      jest.spyOn(service, 'getUserById').mockResolvedValue(mockUser);
      mockFilesService.removeImageFile.mockResolvedValue(void 0);
      jest.spyOn(mockUser, 'save').mockResolvedValue(mockUser3);
      mockAuthService.generateToken.mockResolvedValueOnce(mockToken);
      const result = await service.removeCurrentUserPhoto('token');

      expect(result).toEqual({
        user: mockUser3,
        token: mockToken,
      });
    });
  });

  describe('updateCurrentUserPhoto', () => {
    it('should user with new photo', async () => {
      const mockUser3: User = {
        email: 'email@mail.com',
        firstName: 'John',
        id: '6869d59c-1858-46a2-b8ff-273f29e4566e',
        isAdmin: true,
        lastName: 'Doe',
        photo: 'photo',
        password: 'Pa$$word094',
        save: () => {},
      } as User;
      mockJwtService.verifyAsync.mockResolvedValue({ id: mockUser3.id });
      jest.spyOn(service, 'getUserById').mockResolvedValue(mockUser3);
      mockFilesService.removeImageFile.mockResolvedValue(void 0);
      mockFilesService.createImageFile.mockResolvedValue('photo');
      jest.spyOn(mockUser3, 'save').mockResolvedValue(mockUser3);
      mockAuthService.generateToken.mockResolvedValueOnce(mockToken);
      const mockImage: Express.Multer.File = {} as Express.Multer.File;
      const result = await service.updateCurrentUserPhoto(mockImage, 'token');

      expect(result).toEqual({
        user: mockUser3,
        token: mockToken,
      });
    });
  });

  describe('removeUserCommentsDescendants', () => {
    it('should remove user comments', async () => {
      const mockComment: Comment = {
        id: 'c0894f95-cc73-4c8d-9fcd-593445733858',
        content: 'comment',
        createdAt: '',
        updatedAt: '',
        likesUsersIds: [mockUser.id],
        dislikesUsersIds: [mockUser2.id],
        userId: mockUser.id,
        user: mockUser,
      } as Comment;
      const mockComment2: Comment = {
        id: 'd7975de2-9a28-4359-ba68-523d8e9dcf18',
        content: 'comment',
        createdAt: '',
        updatedAt: '',
        likesUsersIds: [mockUser.id],
        dislikesUsersIds: [mockUser2.id],
        userId: mockUser.id,
        user: mockUser,
      } as Comment;
      const mockComments: Comment[] = [mockComment, mockComment2];
      const mockDescIds: string[][] = [
        [
          '761b68c4-90b0-4854-bcf1-4c46e1b050dc',
          'c32f37e0-f55e-45f9-a15e-8954397c4a11',
        ],
        [
          'e8b88dc4-e5b5-4381-969c-4cd5d3609c10',
          'd4e2595b-45b8-49fa-8bee-3549e7aa8b0e',
        ],
      ];
      mockCommentsService.getAllCommentsByUserId.mockResolvedValue(
        mockComments,
      );
      for (let i = 0; i < mockComments.length; i++) {
        mockCommentsService.getDescendantsIds.mockResolvedValueOnce(
          mockDescIds[i],
        );
      }
      await service.removeUserCommentsDescendants(mockUser.id);

      expect(mockCommentsService.removeCommentsArray).toHaveBeenCalledWith(
        mockDescIds.flat(),
      );
    });
  });
});
