import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AdminGuard } from '../auth/guards/admin/admin.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { UserWithNullTokenDto } from './dto/user-with-null-token.dto';
import { User } from './models/user.model';
import { UsersListDto } from './dto/users-list.dto';
import { UserWithTokenDto } from './dto/user-with-token.dto';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UsersController', () => {
  let controller: UsersController;
  const mockUsersService = {
    updateUserRole: jest.fn(),
    getAllUsersWithParams: jest.fn(),
    getCurrentUser: jest.fn(),
    removeCurrentUserPhoto: jest.fn(),
    removeCurrentUser: jest.fn(),
    removeUser: jest.fn(),
    updateCurrentUserPhoto: jest.fn(),
    updateCurrentUser: jest.fn(),
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
    id: '6869d59c-1858-46a2-b8ff-273f29e4566e',
    isAdmin: false,
    lastName: 'Doe',
    photo: null,
  } as User;
  const mockUser2: User = {
    email: 'email2@mail.com',
    firstName: 'Jane',
    id: '51f1b251-0348-4b84-8009-4e8c3e2569ec',
    isAdmin: true,
    lastName: 'Doe',
    photo: 'photo',
  } as User;
  const userWithNullToken: UserWithNullTokenDto = {
    user: mockUser,
    token: null,
  };
  const userWithToken: UserWithTokenDto = {
    user: mockUser,
    token: {
      token: 'token',
      exp: 60,
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: mockUsersService }],
    })
      .overrideGuard(AdminGuard)
      .useValue(mockAdminGuard)
      .overrideGuard(JwtAuthGuard)
      .useValue(mockJwtAuthGuard)
      .compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('updateUserRole', () => {
    it('should update user role', async () => {
      const mockRoleData: UpdateUserRoleDto = {
        isAdmin: false,
        userId: '6869d59c-1858-46a2-b8ff-273f29e4566e',
      };
      mockUsersService.updateUserRole.mockResolvedValue(userWithNullToken);
      const result = await controller.updateUserRole(mockRequest, mockRoleData);

      expect(result).toEqual(userWithNullToken);
    });
  });

  describe('getAllUsers', () => {
    it('should get list of users', async () => {
      const expectedResult: UsersListDto = {
        total: 22,
        users: [mockUser, mockUser2],
      };
      mockUsersService.getAllUsersWithParams.mockResolvedValue(expectedResult);
      const result = await controller.getAllUsers(3, 10, 'default', 'default', '');

      expect(result).toEqual(expectedResult);
    });
  });

  describe('getCurrentUser', () => {
    it('should get current user', async () => {
      mockUsersService.getCurrentUser.mockResolvedValue(mockUser);
      const result = await controller.getCurrentUser(mockRequest);

      expect(result).toEqual(mockUser);
    });
  });

  describe('removeCurrentUserPhoto', () => {
    it('should delete photo', async () => {
      mockUsersService.removeCurrentUserPhoto.mockResolvedValue(mockUser);
      const result = await controller.removeCurrentUserPhoto(mockRequest);

      expect(result).toEqual(mockUser);
    });
  });

  describe('removeCurrentUser', () => {
    it('should remove current user', async () => {
      mockUsersService.removeCurrentUser.mockResolvedValue(void 0);
      const result = await controller.removeCurrentUser(mockRequest);

      expect(result).toBeUndefined();
    });
  });

  describe('removeUser', () => {
    it('should remove user', async () => {
      mockUsersService.removeUser.mockResolvedValue(void 0);
      const userId = '6869d59c-1858-46a2-b8ff-273f29e4566e';
      const result = await controller.removeUser(userId);

      expect(result).toBeUndefined();
    });
  });

  describe('updateCurrentUserPhoto', () => {
    it('should update photo', async () => {
      const mockImage: Express.Multer.File = {} as Express.Multer.File;
      mockUsersService.updateCurrentUserPhoto.mockResolvedValue(userWithToken);
      const result = await controller.updateCurrentUserPhoto(mockRequest, mockImage);

      expect(result).toEqual(userWithToken);
    });
  });

  describe('updateCurrentUser', () => {
    it('should update current user', async () => {
      const userData: UpdateUserDto = {
        email: 'email@mail.com',
        firstName: 'John',
        lastName: 'Doe',
        newPassword: null,
        password: 'Pa$$word094',
      };
      mockUsersService.updateCurrentUser.mockResolvedValue(userWithToken);
      const result = await controller.updateCurrentUser(mockRequest, userData);

      expect(result).toEqual(userWithToken);
    });
  });
});
