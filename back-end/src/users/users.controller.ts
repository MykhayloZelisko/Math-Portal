import {
  Controller,
  Get,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  Req,
  UploadedFile,
  UseInterceptors,
  Query,
  UsePipes,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { User } from './models/user.model';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin/admin.guard';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserWithTokenDto } from './dto/user-with-token.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UsersListDto } from './dto/users-list.dto';
import { UserWithNullTokenDto } from './dto/user-with-null-token.dto';
import { ValidationPipe } from '../pipes/validation/validation.pipe';
import { ParseIntegerPipe } from '../pipes/parse-integer/parse-integer.pipe';
import { SortingPipe } from '../pipes/sorting/sorting.pipe';
import { ParseUUIDv4Pipe } from '../pipes/parse-uuidv4/parse-UUIDv4.pipe';
import { ParseImageFilePipe } from '../pipes/parse-image-file/parse-image-file.pipe';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  public constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Update user role' })
  @ApiResponse({ status: HttpStatus.OK, type: UserWithNullTokenDto })
  @UseGuards(AdminGuard)
  @UsePipes(ValidationPipe)
  @ApiBearerAuth()
  @Put('/role')
  public async updateUserRole(
    @Req() request: Request,
    @Body() updateUserRoleDto: UpdateUserRoleDto,
  ): Promise<UserWithNullTokenDto> {
    const token = request.headers['authorization'].split(' ')[1]; // eslint-disable-line
    return this.usersService.updateUserRole(updateUserRoleDto, token);
  }

  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: HttpStatus.OK, type: UsersListDto })
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @Get()
  public async getAllUsers(
    @Query('page', ParseIntegerPipe) page: number,
    @Query('size', ParseIntegerPipe) size: number,
    @Query('sortByName', SortingPipe) sortByName: string,
    @Query('sortByRole', SortingPipe) sortByRole: string,
    @Query('filter') filter: string,
  ): Promise<UsersListDto> {
    return this.usersService.getAllUsersWithParams(
      page,
      size,
      sortByName,
      sortByRole,
      filter,
    );
  }

  @ApiOperation({ summary: 'Get current user' })
  @ApiResponse({ status: HttpStatus.OK, type: User })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('/current')
  public async getCurrentUser(@Req() request: Request): Promise<User> {
    const token = request.headers['authorization'].split(' ')[1]; // eslint-disable-line
    return this.usersService.getCurrentUser(token);
  }

  @ApiOperation({ summary: 'Delete current user photo' })
  @ApiResponse({ status: HttpStatus.OK, type: UserWithTokenDto })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete('/current/photo')
  public async removeCurrentUserPhoto(
    @Req() request: Request,
  ): Promise<UserWithTokenDto> {
    const token = request.headers['authorization'].split(' ')[1]; // eslint-disable-line
    return this.usersService.removeCurrentUserPhoto(token);
  }

  @ApiOperation({ summary: 'Delete current user' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete('/current')
  public async removeCurrentUser(@Req() request: Request): Promise<void> {
    const token = request.headers['authorization'].split(' ')[1]; // eslint-disable-line
    return this.usersService.removeCurrentUser(token);
  }

  @ApiOperation({ summary: 'Delete user' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @Delete(':id')
  public async removeUser(
    @Param('id', ParseUUIDv4Pipe) id: string,
  ): Promise<void> {
    return this.usersService.removeUser(id);
  }

  @ApiOperation({ summary: 'Update current user photo' })
  @ApiResponse({ status: HttpStatus.OK, type: UserWithTokenDto })
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiBearerAuth()
  @Put('/current/photo')
  public async updateCurrentUserPhoto(
    @Req() request: Request,
    @UploadedFile(ParseImageFilePipe) image: Express.Multer.File,
  ): Promise<UserWithTokenDto> {
    const token = request.headers['authorization'].split(' ')[1]; // eslint-disable-line
    return this.usersService.updateCurrentUserPhoto(image, token);
  }

  @ApiOperation({ summary: 'Update current user' })
  @ApiResponse({ status: HttpStatus.OK, type: UserWithTokenDto })
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  @ApiBearerAuth()
  @Put('/current')
  public async updateCurrentUser(
    @Req() request: Request,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserWithTokenDto> {
    const token = request.headers['authorization'].split(' ')[1]; // eslint-disable-line
    return this.usersService.updateCurrentUser(updateUserDto, token);
  }
}
