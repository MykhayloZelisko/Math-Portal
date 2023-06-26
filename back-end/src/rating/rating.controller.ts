import { Body, Controller, Post, UseGuards } from '@nestjs/common';
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

@ApiTags('Rating')
@Controller('rating')
export class RatingController {
  public constructor(private readonly ratingService: RatingService) {}

  @ApiOperation({ summary: 'Update rating for current article' })
  @ApiResponse({ status: 201, type: ArticleRatingDto })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post()
  public updateArticleRating(@Body() createRatingDto: CreateRatingDto) {
    return this.ratingService.updateArticleRating(createRatingDto);
  }
}
