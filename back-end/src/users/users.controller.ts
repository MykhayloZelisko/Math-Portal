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

@ApiTags('Users')
@Controller('users')
export class UsersController {
  public constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Update user role' })
  @ApiResponse({ status: 200, type: UserWithNullTokenDto })
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @Put('/role')
  public updateUserRole(
    @Req() request: Request,
    @Body() updateUserRoleDto: UpdateUserRoleDto,
  ) {
    const token = request.headers['authorization'].split(' ')[1];
    return this.usersService.updateUserRole(updateUserRoleDto, { token });
  }

  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, type: UsersListDto })
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @Get()
  public getAllUsers(
    @Query('page') page: number,
    @Query('size') size: number,
    @Query('sortByName') sortByName: string,
    @Query('sortByRole') sortByRole: string,
    @Query('filter') filter: string,
  ) {
    return this.usersService.getAllUsersWithParams(
      page,
      size,
      sortByName,
      sortByRole,
      filter,
    );
  }

  @ApiOperation({ summary: 'Get current user' })
  @ApiResponse({ status: 200, type: User })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('/current')
  public getCurrentUser(@Req() request: Request) {
    const token = request.headers['authorization'].split(' ')[1];
    return this.usersService.getCurrentUser({ token });
  }

  @ApiOperation({ summary: 'Delete current user photo' })
  @ApiResponse({ status: 200, type: UserWithTokenDto })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete('/current/photo')
  public removeCurrentUserPhoto(@Req() request: Request) {
    const token = request.headers['authorization'].split(' ')[1];
    return this.usersService.removeCurrentUserPhoto({ token });
  }

  @ApiOperation({ summary: 'Delete current user' })
  @ApiResponse({ status: 200 })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete('/current')
  public removeCurrentUser(@Req() request: Request) {
    const token = request.headers['authorization'].split(' ')[1];
    return this.usersService.removeCurrentUser({ token });
  }

  @ApiOperation({ summary: 'Delete user' })
  @ApiResponse({ status: 200 })
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @Delete(':id')
  public removeUser(@Param('id') id: string) {
    return this.usersService.removeUser(+id);
  }

  @ApiOperation({ summary: 'Update current user photo' })
  @ApiResponse({ status: 200, type: UserWithTokenDto })
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
  public updateCurrentUserPhoto(
    @Req() request: Request,
    @UploadedFile() image: Express.Multer.File,
  ) {
    const token = request.headers['authorization'].split(' ')[1];
    return this.usersService.updateCurrentUserPhoto(image, { token });
  }

  @ApiOperation({ summary: 'Update current user' })
  @ApiResponse({ status: 200, type: UserWithTokenDto })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Put('/current')
  public updateCurrentUser(
    @Req() request: Request,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const token = request.headers['authorization'].split(' ')[1];
    return this.usersService.updateCurrentUser({ token }, updateUserDto);
  }
}
