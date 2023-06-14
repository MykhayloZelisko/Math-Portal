import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
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
    const user = await this.userRepository.findOne({ where: { id } });
    if (user) {
      await this.userRepository.destroy({ where: { id } });
      return true;
    }
    throw new BadRequestException({ message: 'User not found' });
  }

  public async removeCurrentUser(tokenDto: TokenDto) {
    const currentUser = await this.jwtService.verifyAsync(tokenDto.token);
    const user = await this.userRepository.findOne({
      where: { id: currentUser.id },
    });
    if (user) {
      await this.userRepository.destroy({ where: { id: user.id } });
      return;
    }
    throw new BadRequestException({ message: 'User not found' });
  }

  public async getUserByEmail(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    return user;
  }

  public async updateUserRole(updateUserRoleDto: UpdateUserRoleDto) {
    const user = await this.userRepository.findByPk(updateUserRoleDto.userId);
    if (user) {
      user.isAdmin = updateUserRoleDto.isAdmin;
      await user.save();
      return user;
    }
    throw new BadRequestException({ message: 'User not found' });
  }

  public async getCurrentUser(tokenDto: TokenDto) {
    const userByToken = await this.jwtService.verifyAsync(tokenDto.token);
    if (userByToken) {
      const user = await this.userRepository.findByPk(userByToken.id);
      if (user) {
        return user;
      }
    }
    throw new BadRequestException({ message: 'User not found' });
  }

  public async updateUser(tokenDto: TokenDto, updateUserDto: UpdateUserDto) {
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
        await this.userRepository.update(
          {
            email: updateUserDto.email,
            firstName: updateUserDto.firstName,
            lastName: updateUserDto.lastName,
            password: hashPassword,
            isAdmin: user.isAdmin,
          },
          {
            where: { id: user.id },
          },
        );
        const updatedUser = await this.userRepository.findByPk(user.id);
        const token = await this.authService.generateToken(updatedUser);
        return { user: updatedUser, token: token };
      }
    }
    throw new BadRequestException({ message: 'User not found' });
  }
}
