import {
  BadRequestException,
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from '../users/models/user.model';

@Injectable()
export class AuthService {
  public constructor(
    @Inject(forwardRef(() => UsersService)) private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  public async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto);
    return this.generateToken(user);
  }

  public async registration(createUserDto: CreateUserDto) {
    if (
      !createUserDto.email ||
      !createUserDto.password ||
      !createUserDto.firstName ||
      !createUserDto.lastName
    ) {
      throw new BadRequestException({
        message: 'User data is incorrect',
      });
    }
    const candidate = await this.userService.getUserByEmail(
      createUserDto.email,
    );
    if (candidate) {
      throw new ConflictException({
        message: 'A user with this email already exists',
      });
    }
    const hashPassword = await bcrypt.hash(createUserDto.password, 5);
    await this.userService.createUser({
      ...createUserDto,
      password: hashPassword,
    });
  }

  public async generateToken(user: User) {
    const payload = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      isAdmin: user.isAdmin,
    };
    return {
      token: this.jwtService.sign(payload),
    };
  }

  private async validateUser(loginDto: LoginDto) {
    if (!loginDto.email || !loginDto.password) {
      throw new BadRequestException({
        message: 'User data is incorrect',
      });
    }
    const user = await this.userService.getUserByEmail(loginDto.email);
    if (user) {
      const passwordEquals = await bcrypt.compare(
        loginDto.password,
        user.password,
      );
      if (passwordEquals) {
        return user;
      }
    }
    throw new UnauthorizedException({
      message: 'Email or password is incorrect',
    });
  }
}
