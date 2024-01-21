import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/models/user.model';
import { TokenWithExpDto } from './dto/token-with-exp.dto';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

describe('AuthService', () => {
  let service: AuthService;
  const mockUsersService = {
    getUserByEmail: jest.fn(),
    createUser: jest.fn(),
  };
  const mockJwtService = {
    sign: jest.fn(),
    verify: jest.fn(),
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
  const mockToken: TokenWithExpDto = {
    token: 'token',
    exp: 60,
  };
  const mockLoginData: LoginDto = {
    email: 'email@mail.com',
    password: 'Pa$$word094',
  };
  const mockRegData: CreateUserDto = {
    email: 'email@mail.com',
    firstName: 'John',
    lastName: 'Doe',
    password: 'Pa$$word094',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('should return token', async () => {
      jest.spyOn(service, 'validateUser').mockResolvedValue(mockUser);
      jest.spyOn(service, 'generateToken').mockResolvedValue(mockToken);
      const result = await service.login(mockLoginData);

      expect(result).toEqual(mockToken);
      expect(service.generateToken).toHaveBeenCalledWith(mockUser);
      expect(service.validateUser).toHaveBeenCalledWith(mockLoginData);
    });
  });

  describe('registration', () => {
    it('should throw conflict exception', async () => {
      mockUsersService.getUserByEmail.mockResolvedValue(mockUser);
      const result = service.registration(mockRegData);

      await expect(result).rejects.toThrow(
        new ConflictException('A user with this email already exists'),
      );
    });

    it('should create user', async () => {
      mockUsersService.getUserByEmail.mockResolvedValue(null);
      const hashPassword = 'hash password';
      const mockUserWithHash: CreateUserDto = {
        ...mockRegData,
        password: hashPassword,
      };
      jest
        .spyOn(bcrypt, 'hash')
        .mockImplementation(() => Promise.resolve(hashPassword));
      await service.registration(mockRegData);

      expect(mockUsersService.createUser).toHaveBeenCalledWith(
        mockUserWithHash,
      );
    });
  });

  describe('generateToken', () => {
    it('should return token', async () => {
      mockJwtService.sign.mockReturnValue('token');
      mockJwtService.verify.mockReturnValue({ exp: 60 });
      const result = await service.generateToken(mockUser);
      const payload = {
        id: mockUser.id,
        email: mockUser.email,
        firstName: mockUser.firstName,
        lastName: mockUser.lastName,
        isAdmin: mockUser.isAdmin,
        photo: mockUser.photo,
      };

      expect(result).toEqual(mockToken);
      expect(mockJwtService.sign).toHaveBeenCalledWith(payload);
      expect(mockJwtService.verify).toHaveBeenCalledWith('token');
    });
  });

  describe('validateUser', () => {
    it('should throw exception when user is not found', async () => {
      mockUsersService.getUserByEmail.mockResolvedValue(null);
      const result = service.validateUser(mockLoginData);

      await expect(result).rejects.toThrow(
        new UnauthorizedException('Email or password is incorrect'),
      );
    });

    it('should throw exception when passwords are not equals', async () => {
      mockUsersService.getUserByEmail.mockResolvedValue(mockUser);
      jest
        .spyOn(bcrypt, 'compare')
        .mockImplementation(() => Promise.resolve(false));
      const result = service.validateUser(mockLoginData);

      await expect(result).rejects.toThrow(
        new UnauthorizedException('Email or password is incorrect'),
      );
    });

    it('should return user', async () => {
      mockUsersService.getUserByEmail.mockResolvedValue(mockUser);
      jest
        .spyOn(bcrypt, 'compare')
        .mockImplementation(() => Promise.resolve(true));
      const result = await service.validateUser(mockLoginData);

      expect(result).toEqual(mockUser);
    });
  });
});
