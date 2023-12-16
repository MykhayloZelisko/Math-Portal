import {
  BadRequestException,
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { CreateRatingDto } from './dto/create-rating.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Rating } from './models/rating.model';
import { UsersService } from '../users/users.service';
import { ArticlesService } from '../articles/articles.service';
import { JwtService } from '@nestjs/jwt';
import { Op } from 'sequelize';
import { ArticleRatingDto } from './dto/article-rating.dto';
import { CurrentArticleStatusDto } from './dto/current-article-status.dto';

@Injectable()
export class RatingService {
  public constructor(
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
    private articlesService: ArticlesService,
    private jwtService: JwtService,
    @InjectModel(Rating) private ratingRepository: typeof Rating,
  ) {}

  public async updateArticleRating(
    createRatingDto: CreateRatingDto,
    token: string,
  ): Promise<ArticleRatingDto> {
    const userByToken = await this.jwtService.verifyAsync(token);
    const user = await this.usersService.getUserById(userByToken.id);
    const article = await this.articlesService.getArticleById(
      createRatingDto.articleId,
    );
    if (!user || !article) {
      throw new BadRequestException('Rating is not updated');
    }
    const articleStatus = await this.getCurrentArticleStatus(
      createRatingDto.articleId,
      token,
    );
    if (!articleStatus.canBeRated) {
      throw new ConflictException('Rating cannot be updated');
    }
    const rating = await this.ratingRepository.create({
      ...createRatingDto,
      userId: user.id,
    });
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
    const articleRating =
      Math.round((sumRatingCurrentArticle / countRatingCurrentArticle) * 100) /
      100;
    article.rating = articleRating;
    article.votes = countRatingCurrentArticle;
    await article.save();
    return {
      rating: articleRating,
      votes: countRatingCurrentArticle,
    };
  }

  public async getCurrentArticleStatus(
    articleId: string,
    token: string,
  ): Promise<CurrentArticleStatusDto> {
    try {
      const userByToken = await this.jwtService.verifyAsync(token);
      const user = await this.usersService.getUserById(userByToken.id);
      const article = await this.articlesService.getArticleById(articleId);
      if (!user || !article) {
        return { canBeRated: false };
      }
      const rating = await this.ratingRepository.findOne({
        where: {
          [Op.and]: [
            {
              articleId: articleId,
            },
            {
              userId: user.id,
            },
          ],
        },
      });
      return { canBeRated: rating === null };
    } catch (e) {
      return { canBeRated: false };
    }
  }

  public async recalculateArticlesRating(userId: string): Promise<void> {
    const articlesIds = await this.ratingRepository.findAll({
      attributes: ['articleId'],
      where: { userId },
    });
    const ids = articlesIds.map((row: Rating) => row.articleId);

    for (const articleId of ids) {
      const article = await this.articlesService.getArticleById(articleId);
      const sumRatingCurrentArticle = await this.ratingRepository.sum('rate', {
        where: {
          articleId: articleId,
          userId: {
            [Op.not]: userId,
          },
        },
      });
      const countRatingCurrentArticle = await this.ratingRepository.count({
        where: {
          articleId: articleId,
          userId: {
            [Op.not]: userId,
          },
        },
      });
      article.rating =
        Math.round(
          (sumRatingCurrentArticle / countRatingCurrentArticle) * 100,
        ) / 100;
      article.votes = countRatingCurrentArticle;
      await article.save();
    }
  }
}
