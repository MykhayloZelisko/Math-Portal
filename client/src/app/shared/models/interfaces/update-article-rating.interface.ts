import { RatingType } from '../types/rating.type';

export interface UpdateArticleRatingInterface {
  rate: RatingType;
  articleId: number;
}
