import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Query,
  Req,
  UseGuards,
  UsePipes,
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
import { ValidationPipe } from '../pipes/validation/validation.pipe';
import { ParseUUIDv4Pipe } from '../pipes/parse-uuidv4/parse-UUIDv4.pipe';

@ApiTags('Rating')
@Controller('rating')
export class RatingController {
  public constructor(private readonly ratingService: RatingService) {}

  @ApiOperation({ summary: 'Update rating for current article' })
  @ApiResponse({ status: HttpStatus.CREATED, type: ArticleRatingDto })
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  @ApiBearerAuth()
  @Post()
  public async updateArticleRating(
    @Req() request: Request,
    @Body() createRatingDto: CreateRatingDto,
  ): Promise<ArticleRatingDto> {
    const token = request.headers['authorization'].split(' ')[1]; // eslint-disable-line
    return this.ratingService.updateArticleRating(createRatingDto, token);
  }

  @ApiOperation({
    summary: 'Check if the article can be rated by the current user',
  })
  @ApiResponse({ status: HttpStatus.OK, type: CurrentArticleStatusDto })
  @ApiBearerAuth()
  @Get()
  public async getCurrentArticleStatus(
    @Req() request: Request,
    @Query('articleId', ParseUUIDv4Pipe) articleId: string,
  ): Promise<CurrentArticleStatusDto> {
    const token = request.headers['authorization'] // eslint-disable-line
      ? request.headers['authorization'].split(' ')[1] // eslint-disable-line
      : '';
    return this.ratingService.getCurrentArticleStatus(articleId, token);
  }
}
