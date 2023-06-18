import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRatingDto } from './dto/create-rating.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Rating } from './models/rating.model';
import { TokenDto } from '../auth/dto/token.dto';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/models/user.model';
import { Article } from '../articles/models/article.model';

@Injectable()
export class RatingService {
  public constructor(
    @InjectModel(Rating) private ratingRepository: typeof Rating,
    @InjectModel(User) private userRepository: typeof User,
    @InjectModel(Article) private articleRepository: typeof Article,
    private jwtService: JwtService,
  ) {}

  public async updateArticleRating(
    createRatingDto: CreateRatingDto,
    tokenDto: TokenDto,
  ) {
    const isAvailableRating = await this.isRatingAvailable(
      createRatingDto.articleId,
      tokenDto,
    );
    if (!isAvailableRating.isAvailable || !createRatingDto.rate) {
      throw new BadRequestException({ message: 'Rating is not updated' });
    }
    const userByToken = await this.jwtService.verifyAsync(tokenDto.token);
    const user = await this.userRepository.findByPk(userByToken.id);
    const article = await this.articleRepository.findByPk(
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

  public async isRatingAvailable(articleId: number, tokenDto: TokenDto) {
    if (!tokenDto || !tokenDto.token) {
      return {
        isAvailable: false,
      };
    }
    const user = await this.jwtService.verifyAsync(tokenDto.token);
    if (user) {
      const rate = await this.ratingRepository.findOne({
        where: {
          userId: user.id,
          articleId: articleId,
        },
      });
      return {
        isAvailable: !rate,
      };
    }
    return {
      isAvailable: false,
    };
  }
}
