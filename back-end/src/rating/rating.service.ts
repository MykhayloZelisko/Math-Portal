import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRatingDto } from './dto/create-rating.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Rating } from './models/rating.model';
import { UsersService } from '../users/users.service';
import { ArticlesService } from '../articles/articles.service';

@Injectable()
export class RatingService {
  public constructor(
    private usersService: UsersService,
    private articlesService: ArticlesService,
    @InjectModel(Rating) private ratingRepository: typeof Rating,
  ) {}

  public async updateArticleRating(createRatingDto: CreateRatingDto) {
    if (
      !createRatingDto.rate ||
      !createRatingDto.articleId ||
      !createRatingDto.userId
    ) {
      throw new BadRequestException({ message: 'Rating is not updated' });
    }
    const user = await this.usersService.getUserById(createRatingDto.userId);
    const article = await this.articlesService.getArticleById(
      createRatingDto.articleId,
    );
    if (!user || !article) {
      throw new BadRequestException({ message: 'Rating is not updated' });
    }
    const rating = await this.ratingRepository.create(createRatingDto);
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
}
