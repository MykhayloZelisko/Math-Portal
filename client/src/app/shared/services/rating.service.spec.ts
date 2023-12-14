import { TestBed } from '@angular/core/testing';
import { RatingService } from './rating.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { CurrentArticleStatusInterface } from '../models/interfaces/current-article-status.interface';
import { UpdateArticleRatingInterface } from '../models/interfaces/update-article-rating.interface';
import { CurrentArticleRatingInterface } from '../models/interfaces/current-article-rating.interface';

describe('RatingService', () => {
  let service: RatingService;
  let httpController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(RatingService);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getCurrentArticleStatus', () => {
    it('should send request', () => {
      const articleId = '35c90c0b-ba58-46f3-a091-bcdf66f514a8';
      const expectedResult: CurrentArticleStatusInterface = {
        canBeRated: true,
      };
      service.getCurrentArticleStatus(articleId).subscribe((result) => {
        expect(result).toBe(expectedResult);
      });

      const req = httpController.expectOne(
        `${service.baseUrl}?articleId=${articleId}`,
      );
      expect(req.request.method).toBe('GET');
      req.flush(expectedResult);
      httpController.verify();
    });
  });

  describe('updateArticleRating', () => {
    it('should send request', () => {
      const mockData: UpdateArticleRatingInterface = {
        articleId: '35c90c0b-ba58-46f3-a091-bcdf66f514a8',
        rate: 4,
      };
      const expectedResult: CurrentArticleRatingInterface = {
        rating: 3.7,
        votes: 7,
      };
      service.updateArticleRating(mockData).subscribe((result) => {
        expect(result).toBe(expectedResult);
      });

      const req = httpController.expectOne(`${service.baseUrl}`);
      expect(req.request.method).toBe('POST');
      req.flush(expectedResult);
      httpController.verify();
    });
  });
});
