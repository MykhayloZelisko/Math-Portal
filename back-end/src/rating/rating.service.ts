import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateRatingDto } from './dto/create-rating.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Rating } from './models/rating.model';
import { UsersService } from '../users/users.service';
import { ArticlesService } from '../articles/articles.service';
import { TokenDto } from '../auth/dto/token.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RatingService {
  public constructor(
    private usersService: UsersService,
    private articlesService: ArticlesService,
    private jwtService: JwtService,
    @InjectModel(Rating) private ratingRepository: typeof Rating,
  ) {}

  public async updateArticleRating(createRatingDto: CreateRatingDto, tokenDto: TokenDto) {
    if (
      !createRatingDto.rate ||
      !createRatingDto.articleId
    ) {
      throw new BadRequestException({ message: 'Rating is not updated' });
    }
    const userByToken = await this.jwtService.verifyAsync(tokenDto.token);
    if (userByToken) {
      const user = await this.usersService.getUserById(userByToken.id);
      const article = await this.articlesService.getArticleById(
        createRatingDto.articleId,
      );
      if (!user || !article) {
        throw new BadRequestException({ message: 'Rating is not updated' });
      }
      const rating = await this.ratingRepository.create({ ...createRatingDto, userId: user.id });
      await rating.$set('user', user);
      await rating.$set('article', article);
      const sumRatingCurrentArticle = await this.ratingRepository.sum('rate', {
        where: {
          articleId: createRatingDto.articleId,
        },
      });
      const countRatingCurrentArticle = await this.ratingRepository.count({
        where: {
          articleId: createRatingDto.articleId,
        },
      });
      const articleRating = sumRatingCurrentArticle / countRatingCurrentArticle;
      article.rating = articleRating;
      await article.save();
      return {
        rating: articleRating,
      };
    }
    throw new NotFoundException({ message: 'User not found'})
  }
}
