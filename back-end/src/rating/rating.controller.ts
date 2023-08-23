import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards, UsePipes,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { RatingService } from './rating.service';
import { ArticleRatingDto } from './dto/article-rating.dto';
import { CreateRatingDto } from './dto/create-rating.dto';
import { CurrentArticleStatusDto } from './dto/current-article-status.dto';
import { AuthWithoutExceptionsGuard } from '../auth/guards/auth-without-exceptions/auth-without-exceptions.guard';
import { ValidationPipe } from '../pipes/validation/validation.pipe';

@ApiTags('Rating')
@Controller('rating')
export class RatingController {
  public constructor(private readonly ratingService: RatingService) {}

  @ApiOperation({ summary: 'Update rating for current article' })
  @ApiResponse({ status: 201, type: ArticleRatingDto })
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  @ApiBearerAuth()
  @Post()
  public updateArticleRating(
    @Req() request: Request,
    @Body() createRatingDto: CreateRatingDto,
  ) {
    const token = request.headers['authorization'].split(' ')[1]; // eslint-disable-line
    return this.ratingService.updateArticleRating(createRatingDto, token);
  }

  @ApiOperation({
    summary: 'Check if the article can be rated by the current user',
  })
  @ApiResponse({ status: 200, type: CurrentArticleStatusDto })
  @UseGuards(AuthWithoutExceptionsGuard)
  @ApiBearerAuth()
  @Get()
  public getCurrentArticleStatus(
    @Req() request: Request,
    @Query('articleId') articleId: string,
  ) {
    const token = request.headers['authorization'] // eslint-disable-line
      ? request.headers['authorization'].split(' ')[1] // eslint-disable-line
      : '';
    return this.ratingService.getCurrentArticleStatus(articleId, token);
  }
}
