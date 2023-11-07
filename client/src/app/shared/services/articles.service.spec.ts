import { TestBed } from '@angular/core/testing';

import { ArticlesService } from './articles.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { CreateArticleInterface } from '../models/interfaces/create-article.interface';
import { ArticleInterface } from '../models/interfaces/article.interface';
import { ArticlesListParamsInterface } from '../models/interfaces/articles-list-params.interface';
import { ArticlesListInterface } from '../models/interfaces/articles-list.interface';

describe('ArticlesService', () => {
  let service: ArticlesService;
  let httpController: HttpTestingController;
  const mockArticle: ArticleInterface = {
    id: '23a54326-57d8-41c7-b161-3627acd47d03',
    title: 'Title',
    content: 'Content',
    tags: [
      {
        id: 'f81361ca-d151-4111-9233-49d8cd5d116c',
        value: 'Tag 1',
      },
      {
        id: '6785101c-cc10-445e-a7d2-ae38e6c39dac',
        value: 'Tag 2',
      },
    ],
    rating: 0,
    votes: 0,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(ArticlesService);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('createArticle', () => {
    it('should send request', () => {
      const newArticle: CreateArticleInterface = {
        title: 'Title',
        content: 'Content',
        tagsIds: [
          'f81361ca-d151-4111-9233-49d8cd5d116c',
          '6785101c-cc10-445e-a7d2-ae38e6c39dac',
        ],
      };
      const expectedResult: ArticleInterface = mockArticle;
      service.createArticle(newArticle).subscribe((result) => {
        expect(result).toBe(expectedResult);
      });

      const req = httpController.expectOne(`${service.baseUrl}`);
      expect(req.request.method).toBe('POST');
      req.flush(expectedResult);
    });
  });

  describe('getArticlesList', () => {
    it('should send request', () => {
      const params: ArticlesListParamsInterface = {
        page: 1,
        size: 10,
        tagsIds: [
          'f81361ca-d151-4111-9233-49d8cd5d116c',
          '6785101c-cc10-445e-a7d2-ae38e6c39dac',
        ],
        filter: '',
      };
      const expectedResult: ArticlesListInterface = {
        total: 1,
        articles: [mockArticle],
      };
      service.getArticlesList(params).subscribe((result) => {
        expect(result).toBe(expectedResult);
      });

      const req = httpController.expectOne(
        `${service.baseUrl}?page=${params.page}&size=${params.size}&filter=${
          params.filter
        }&tagsIds=${params.tagsIds.join(',')}`,
      );
      expect(req.request.method).toBe('GET');
      req.flush(expectedResult);
    });
  });

  describe('getArticle', () => {
    it('should send request', () => {
      const expectedResult: ArticleInterface = mockArticle;
      const id = '23a54326-57d8-41c7-b161-3627acd47d03';
      service.getArticle(id).subscribe((result) => {
        expect(result).toBe(expectedResult);
      });

      const req = httpController.expectOne(`${service.baseUrl}/${id}`);
      expect(req.request.method).toBe('GET');
      req.flush(expectedResult);
    });
  });

  describe('deleteArticle', () => {
    it('should send request', () => {
      const id = '23a54326-57d8-41c7-b161-3627acd47d03';
      service.deleteArticle(id).subscribe();

      const req = httpController.expectOne(`${service.baseUrl}/${id}`);
      expect(req.request.method).toBe('DELETE');
    });
  });

  describe('updateArticle', () => {
    it('should send request', () => {
      const id = '23a54326-57d8-41c7-b161-3627acd47d03';
      const article: CreateArticleInterface = {
        title: 'Title',
        content: 'Content',
        tagsIds: [
          'f81361ca-d151-4111-9233-49d8cd5d116c',
          '6785101c-cc10-445e-a7d2-ae38e6c39dac',
        ],
      };
      const expectedResult: ArticleInterface = mockArticle;
      service.updateArticle(id, article).subscribe((result) => {
        expect(result).toBe(expectedResult);
      });

      const req = httpController.expectOne(`${service.baseUrl}/${id}`);
      expect(req.request.method).toBe('PUT');
      req.flush(expectedResult);
    });
  });
});
