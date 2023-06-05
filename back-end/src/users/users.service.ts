import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './models/user.model';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { TokenDto } from '../auth/dto/token.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  public constructor(
    @InjectModel(User) private userRepository: typeof User,
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
    const user = await this.jwtService.verifyAsync(tokenDto.token);
    if (user) {
      return user;
    }
    throw new BadRequestException({ message: 'User not found' });
  }
}
