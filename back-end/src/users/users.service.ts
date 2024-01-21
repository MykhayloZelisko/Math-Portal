import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './models/user.model';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { JwtService } from '@nestjs/jwt';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthService } from '../auth/auth.service';
import * as bcrypt from 'bcryptjs';
import sequelize, { FindOptions, Op } from 'sequelize';
import { FilesService } from '../files/files.service';
import { TokenWithExpDto } from '../auth/dto/token-with-exp.dto';
import { RatingService } from '../rating/rating.service';
import { CommentsService } from '../comments/comments.service';
import { Comment } from '../comments/models/comment.model';
import { UsersListDto } from './dto/users-list.dto';
import { UserWithTokenDto } from './dto/user-with-token.dto';
import { UserWithNullTokenDto } from './dto/user-with-null-token.dto';

@Injectable()
export class UsersService {
  public constructor(
    @InjectModel(User) private userRepository: typeof User,
    @Inject(forwardRef(() => AuthService)) private authService: AuthService,
    private jwtService: JwtService,
    private filesService: FilesService,
    private ratingService: RatingService,
    @Inject(forwardRef(() => CommentsService))
    private commentsService: CommentsService,
  ) {}

  public async createUser(createUserDto: CreateUserDto): Promise<User> {
    const userWithFullName = {
      ...createUserDto,
      fullName: `${createUserDto.firstName} ${createUserDto.lastName}`,
    };
    return this.userRepository.create(userWithFullName);
  }

  public async getAllUsers(options?: FindOptions<User>): Promise<User[]> {
    return this.userRepository.findAll(options);
  }

  public async getAllUsersWithParams(
    page: number,
    size: number,
    sortByName: string,
    sortByRole: string,
    filter: string,
  ): Promise<UsersListDto> {
    const order: [string, string][] = [];
    if (
      sortByRole.toLowerCase() === 'asc' ||
      sortByRole.toLowerCase() === 'desc'
    ) {
      order.push(['isAdmin', sortByRole]);
    }
    if (
      sortByName.toLowerCase() === 'asc' ||
      sortByName.toLowerCase() === 'desc'
    ) {
      order.push(['fullName', sortByName]);
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
          [Op.or]: [
            sequelize.where(
              sequelize.fn('LOWER', sequelize.col('full_name')),
              'LIKE',
              '%' + filter.trim().toLowerCase() + '%',
            ),
            sequelize.where(
              sequelize.fn('LOWER', sequelize.col('email')),
              'LIKE',
              '%' + filter.trim().toLowerCase() + '%',
            ),
          ],
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

  public async removeUser(id: string): Promise<void> {
    const user = await this.getUserById(id);
    if (user.photo) {
      await this.filesService.removeImageFile(user.photo);
    }
    await this.removeUserCommentsDescendants(user.id);
    await this.ratingService.recalculateArticlesRating(user.id);
    await this.userRepository.destroy({ where: { id } });
  }

  public async removeCurrentUser(token: string): Promise<void> {
    const currentUser = await this.jwtService.verifyAsync(token);
    const user = await this.getUserById(currentUser.id);
    if (user.photo) {
      await this.filesService.removeImageFile(user.photo);
    }
    await this.removeUserCommentsDescendants(user.id);
    await this.ratingService.recalculateArticlesRating(user.id);
    await this.userRepository.destroy({ where: { id: user.id } });
  }

  public async getUserByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  public async getUserById(id: string): Promise<User> {
    const user = await this.userRepository.findByPk(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  public async updateUserRole(
    updateUserRoleDto: UpdateUserRoleDto,
    token: string,
  ): Promise<UserWithNullTokenDto> {
    const userByToken = await this.jwtService.verifyAsync(token);
    const currentUser = await this.getUserById(userByToken.id);
    const user = await this.getUserById(updateUserRoleDto.userId);
    user.isAdmin = updateUserRoleDto.isAdmin;
    const newUser = await user.save();
    let tokenWithExp: TokenWithExpDto | null = null;
    if (user.id === currentUser.id) {
      tokenWithExp = await this.authService.generateToken(newUser);
    }
    return { user: newUser, token: tokenWithExp };
  }

  public async getCurrentUser(token: string): Promise<User> {
    const userByToken = await this.jwtService.verifyAsync(token);
    return this.getUserById(userByToken.id);
  }

  public async updateCurrentUser(
    updateUserDto: UpdateUserDto,
    token: string,
  ): Promise<UserWithTokenDto> {
    const userByToken = await this.jwtService.verifyAsync(token);
    const user = await this.getUserById(userByToken.id);
    const passwordEquals = await bcrypt.compare(
      updateUserDto.password,
      user.password,
    );
    if (!passwordEquals) {
      throw new BadRequestException('Password is incorrect', 'Password Error');
    }
    const hashPassword = updateUserDto.newPassword
      ? await bcrypt.hash(updateUserDto.newPassword, 5)
      : user.password;
    user.email = updateUserDto.email;
    user.lastName = updateUserDto.lastName;
    user.firstName = updateUserDto.firstName;
    user.password = hashPassword;
    const newUser = await user.save();
    const tokenWithExp = await this.authService.generateToken(newUser);
    return { user: newUser, token: tokenWithExp };
  }

  public async removeCurrentUserPhoto(
    token: string,
  ): Promise<UserWithTokenDto> {
    const userByToken = await this.jwtService.verifyAsync(token);
    const user = await this.getUserById(userByToken.id);
    if (user.photo) {
      await this.filesService.removeImageFile(user.photo);
      user.photo = null;
    }
    const newUser = await user.save();
    const tokenWithExp = await this.authService.generateToken(newUser);
    return { user: newUser, token: tokenWithExp };
  }

  public async updateCurrentUserPhoto(
    image: Express.Multer.File,
    token: string,
  ): Promise<UserWithTokenDto> {
    const userByToken = await this.jwtService.verifyAsync(token);
    const user = await this.getUserById(userByToken.id);
    if (user.photo) {
      await this.filesService.removeImageFile(user.photo);
    }
    user.photo = await this.filesService.createImageFile(image);
    const newUser = await user.save();
    const tokenWithExp = await this.authService.generateToken(newUser);
    return { user: newUser, token: tokenWithExp };
  }

  public async removeUserCommentsDescendants(id: string): Promise<void> {
    const userComments = await this.commentsService.getAllCommentsByUserId(id);
    const userCommentsIds = userComments.map((comment: Comment) => comment.id);
    let setOfDescendantsIds = new Set<string>();
    for (const item of userCommentsIds) {
      const descendantsIds = await this.commentsService.getDescendantsIds(item);
      setOfDescendantsIds = new Set([
        ...setOfDescendantsIds,
        ...descendantsIds,
      ]);
    }
    await this.commentsService.removeCommentsArray(
      Array.from(setOfDescendantsIds),
    );
  }
}
