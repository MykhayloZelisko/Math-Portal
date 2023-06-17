import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable, NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './models/user.model';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { TokenDto } from '../auth/dto/token.dto';
import { JwtService } from '@nestjs/jwt';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthService } from '../auth/auth.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  public constructor(
    @InjectModel(User) private userRepository: typeof User,
    @Inject(forwardRef(() => AuthService)) private authService: AuthService,
    private jwtService: JwtService,
  ) {}

  public async createUser(createUserDto: CreateUserDto) {
    const user = await this.userRepository.create(createUserDto);
    return user;
  }

  public async getAllUsers() {
    const users = await this.userRepository.findAll();
    return users;
  }

  public async removeUser(id: number) {
    const user = await this.userRepository.findByPk(id);
    if (user) {
      await this.userRepository.destroy({ where: { id } });
      return;
    }
    throw new NotFoundException({ message: 'User not found' });
  }

  public async removeCurrentUser(tokenDto: TokenDto) {
    const currentUser = await this.jwtService.verifyAsync(tokenDto.token);
    const user = await this.userRepository.findByPk(currentUser.id);
    if (user) {
      await this.userRepository.destroy({ where: { id: user.id } });
      return;
    }
    throw new NotFoundException({ message: 'User not found' });
  }

  public async getUserByEmail(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    return user;
  }

  public async updateUserRole(updateUserRoleDto: UpdateUserRoleDto) {
    const user = await this.userRepository.findByPk(updateUserRoleDto.userId);
    if (user) {
      if (!(updateUserRoleDto.isAdmin ?? undefined)) {
        throw new BadRequestException({ message: 'User is not updated' })
      }
      user.isAdmin = updateUserRoleDto.isAdmin;
      const newUser = await user.save();
      return newUser;
    }
    throw new NotFoundException({ message: 'User not found' });
  }

  public async getCurrentUser(tokenDto: TokenDto) {
    const userByToken = await this.jwtService.verifyAsync(tokenDto.token);
    if (userByToken) {
      const user = await this.userRepository.findByPk(userByToken.id);
      if (user) {
        return user;
      }
    }
    throw new NotFoundException({ message: 'User not found' });
  }

  public async updateUser(tokenDto: TokenDto, updateUserDto: UpdateUserDto) {
    if (!updateUserDto.email || !updateUserDto.password || !updateUserDto.firstName || !updateUserDto.lastName) {
      throw new BadRequestException({ message: 'User is not updated' });
    }
    const userByToken = await this.jwtService.verifyAsync(tokenDto.token);
    if (userByToken) {
      const user = await this.userRepository.findByPk(userByToken.id);
      if (user) {
        const passwordEquals = await bcrypt.compare(
          updateUserDto.password,
          user.password,
        );
        if (!passwordEquals) {
          throw new BadRequestException({ message: 'Password is incorrect' });
        }
        const hashPassword = updateUserDto.newPassword
          ? await bcrypt.hash(updateUserDto.newPassword, 5)
          : user.password;
        user.email = updateUserDto.email;
        user.lastName = updateUserDto.lastName;
        user.firstName = updateUserDto.firstName;
        user.password = hashPassword;
        const newUser = await user.save();
        const token = await this.authService.generateToken(newUser);
        return { user: newUser, token: token };
      }
    }
    throw new NotFoundException({ message: 'User not found' });
  }
}
