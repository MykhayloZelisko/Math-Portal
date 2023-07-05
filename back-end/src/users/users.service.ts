import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
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
import { FindOptions, Op } from 'sequelize';
import { FilesService } from '../files/files.service';

@Injectable()
export class UsersService {
  public constructor(
    @InjectModel(User) private userRepository: typeof User,
    @Inject(forwardRef(() => AuthService)) private authService: AuthService,
    private jwtService: JwtService,
    private filesService: FilesService,
  ) {}

  public async createUser(createUserDto: CreateUserDto) {
    const user = await this.userRepository.create(createUserDto);
    return user;
  }

  public async getAllUsers(options?: FindOptions<User>) {
    const users = await this.userRepository.findAll(options);
    return users;
  }

  public async getAllUsersWithParams(
    page: number,
    size: number,
    sortByName: string,
    sortByRole: string,
    filter: string,
  ) {
    const order = [];
    if (
      sortByRole.toLowerCase() === 'asc' ||
      sortByRole.toLowerCase() === 'desc'
    ) {
      order.push([['isAdmin', sortByRole]]);
    }
    if (
      sortByName.toLowerCase() === 'asc' ||
      sortByName.toLowerCase() === 'desc'
    ) {
      order.push([['fullName', sortByName]]);
    }

    let filterOptions: FindOptions<User> = {
      offset: (page - 1) * size,
      limit: size,
      order: order,
    };
    let countOptions: FindOptions<User> | null = null;
    if (!!filter && !!filter.trim()) {
      countOptions = {
        where: {
          fullName: {
            [Op.substring]: filter,
          },
        },
      };
      filterOptions = {
        ...countOptions,
        ...filterOptions,
      };
    }

    const users = await this.getAllUsers(filterOptions);
    const total = countOptions
      ? await this.userRepository.count(countOptions)
      : await this.userRepository.count();
    return { total, users };
  }

  public async removeUser(id: number) {
    const user = await this.getUserById(id);
    if (user) {
      await this.userRepository.destroy({ where: { id } });
      return;
    }
    throw new NotFoundException({ message: 'User not found' });
  }

  public async removeCurrentUser(tokenDto: TokenDto) {
    const currentUser = await this.jwtService.verifyAsync(tokenDto.token);
    const user = await this.getUserById(currentUser.id);
    if (user) {
      if (user.photo) {
        await this.filesService.removeImageFile(user.photo);
      }
      await this.userRepository.destroy({ where: { id: user.id } });
      return;
    }
    throw new NotFoundException({ message: 'User not found' });
  }

  public async getUserByEmail(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    return user;
  }

  public async getUserById(id: number) {
    const user = await this.userRepository.findByPk(id);
    if (!user) {
      throw new NotFoundException({ message: 'User not found' });
    }
    return user;
  }

  public async updateUserRole(updateUserRoleDto: UpdateUserRoleDto) {
    const user = await this.getUserById(updateUserRoleDto.userId);
    if (user) {
      if (
        updateUserRoleDto.isAdmin !== false &&
        updateUserRoleDto.isAdmin !== true
      ) {
        throw new BadRequestException({ message: 'User is not updated' });
      }
      user.isAdmin = updateUserRoleDto.isAdmin;
      const newUser = await user.save();
      return newUser;
    }
    throw new NotFoundException({ message: 'User not found' });
  }

  public async getCurrentUser(tokenDto: TokenDto) {
    const userByToken = await this.jwtService.verifyAsync(tokenDto.token);
    const user = await this.userRepository.findByPk(userByToken.id);
    if (user) {
      return user;
    }
    throw new NotFoundException({ message: 'User not found' });
  }

  public async updateCurrentUser(
    tokenDto: TokenDto,
    updateUserDto: UpdateUserDto,
  ) {
    if (
      !updateUserDto.email ||
      !updateUserDto.password ||
      !updateUserDto.firstName ||
      !updateUserDto.lastName
    ) {
      throw new BadRequestException({ message: 'User is not updated' });
    }
    const userByToken = await this.jwtService.verifyAsync(tokenDto.token);
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
    throw new NotFoundException({ message: 'User not found' });
  }

  public async removeCurrentUserPhoto(tokenDto: TokenDto) {
    const userByToken = await this.jwtService.verifyAsync(tokenDto.token);
    const user = await this.userRepository.findByPk(userByToken.id);
    if (user && user.photo) {
      await this.filesService.removeImageFile(user.photo);
      user.photo = null;
      const newUser = await user.save();
      const token = await this.authService.generateToken(newUser);
      return { user: newUser, token: token };
    }
    throw new NotFoundException({ message: 'User not found' });
  }

  public async updateCurrentUserPhoto(
    image: Express.Multer.File,
    tokenDto: TokenDto,
  ) {
    const userByToken = await this.jwtService.verifyAsync(tokenDto.token);
    const user = await this.userRepository.findByPk(userByToken.id);
    if (user) {
      try {
        if (user.photo) {
          await this.filesService.removeImageFile(user.photo);
        }
        user.photo = await this.filesService.createImageFile(image);
        const newUser = await user.save();
        const token = await this.authService.generateToken(newUser);
        return { user: newUser, token: token };
      } catch (err) {
        throw new InternalServerErrorException({
          message: 'User photo is not updated',
        });
      }
    }
    throw new NotFoundException({ message: 'User not found' });
  }
}
