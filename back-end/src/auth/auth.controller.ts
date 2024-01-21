import { Body, Controller, HttpStatus, Post, UsePipes } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { TokenWithExpDto } from './dto/token-with-exp.dto';
import { ValidationPipe } from '../pipes/validation/validation.pipe';

@ApiTags('Authorization')
@Controller('auth')
export class AuthController {
  public constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Login' })
  @ApiResponse({ status: HttpStatus.CREATED, type: TokenWithExpDto })
  @UsePipes(ValidationPipe)
  @Post('/login')
  public async login(@Body() loginDto: LoginDto): Promise<TokenWithExpDto> {
    return this.authService.login(loginDto);
  }

  @ApiOperation({ summary: 'Registration' })
  @ApiResponse({ status: HttpStatus.CREATED })
  @UsePipes(ValidationPipe)
  @Post('/registration')
  public async registration(
    @Body() createUserDto: CreateUserDto,
  ): Promise<void> {
    return this.authService.registration(createUserDto);
  }
}
