import {
  Controller,
  Get,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { User } from './models/user.model';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin/admin.guard';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  public constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Update user role' })
  @ApiResponse({ status: 200, type: User })
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @Put('/role')
  public updateUserRole(@Body() updateUserRoleDto: UpdateUserRoleDto) {
    return this.usersService.updateUserRole(updateUserRoleDto);
  }

  @ApiOperation({ summary: 'Get all user' })
  @ApiResponse({ status: 200, type: [User] })
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @Get()
  public getAllUsers() {
    return this.usersService.getAllUsers();
  }

  @ApiOperation({ summary: 'Get current user' })
  @ApiResponse({ status: 200, type: User })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('/current')
  public getCurrentUser(@Req() request: Request) {
    const token = request.headers.authorization.split(' ')[1];
    return this.usersService.getCurrentUser({ token });
  }

  @ApiOperation({ summary: 'Delete current user' })
  @ApiResponse({ status: 200, type: Boolean })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete('/current')
  public removeCurrentUser(@Req() request: Request) {
    const token = request.headers.authorization.split(' ')[1];
    return this.usersService.removeCurrentUser({ token });
  }

  @ApiOperation({ summary: 'Delete user' })
  @ApiResponse({ status: 200, type: Boolean })
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @Delete(':id')
  public removeUser(@Param('id') id: string) {
    return this.usersService.removeUser(+id);
  }
}