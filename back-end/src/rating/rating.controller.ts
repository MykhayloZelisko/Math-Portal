import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
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
import { IsRatingAvailableDto } from './dto/is-rating-available.dto';

@ApiTags('Rating')
@Controller('rating')
export class RatingController {
  public constructor(private readonly ratingService: RatingService) {}

  @ApiOperation({ summary: 'Update rating for current article' })
  @ApiResponse({ status: 201, type: ArticleRatingDto })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post()
  public updateArticleRating(
    @Req() request: Request,
    @Body() createRatingDto: CreateRatingDto,
  ) {
    const token = request.headers['authorization'].split(' ')[1];
    return this.ratingService.updateArticleRating(createRatingDto, { token });
  }

  @ApiOperation({ summary: 'Get rating availability status' })
  @ApiResponse({ status: 200, type: IsRatingAvailableDto })
  @Get(':id')
  public isRatingAvailable(
    @Req() request: Request,
    @Param('articleId') articleId: number,
  ) {
    const token = request.headers['authorization']
      ? request.headers['authorization'].split(' ')[1]
      : null;
    return this.ratingService.isRatingAvailable(articleId, { token });
  }
}
